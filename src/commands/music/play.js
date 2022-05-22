const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Youtube = require('simple-youtube-api')
const ytdl = require('ytdl-core')
const youtube = new Youtube(process.env.YOUTUBE_TOKEN)

module.exports = class PlayCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'play',
      aliases: ['p', 'start'],
      memberName: 'play',
      group: 'music',
      description: 'Play any song or playlist from youtube',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'query',
          prompt: 'What song or playlist would you like to listen to?',
          type: 'string',
          default: (message) => message.author.id,
          validate: function (query) {
            return query.length > 0 && query.length < 200
          }
        }
      ]
    })
  }

  async run (message, { query }) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.say('Join a channel and try again')
    if (
      !voiceChannel
        .permissionsFor(this.client.user)
        .has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])
    ) {
      return message.reply(
        'I\'m missing the "Connect", "Speak", or "View Channel" permission for this channel.'
      )
    }
    if (
      message.guild.musicData.isPlaying === true &&
      voiceChannel.id !== message.guild.musicData.nowPlaying.voiceChannel.id
    ) {
      return message.channel.send({
        embed: {
          description: `Error accepting your request, because you are not in **${message.guild.musicData.nowPlaying.voiceChannel.name}** `,
          color: 'RED'
        }
      })
    }

    if (
      query.match(
        /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
      )
    ) {
      const playlist = await youtube.getPlaylist(query).catch(function () {
        return message.say('Playlist is either private or it does not exist!')
      })
      // remove the 10 if you removed the queue limit conditions below
      const videosObj = await playlist.getVideos().catch(function () {
        return message.say(
          'There was a problem getting one of the videos in the playlist!'
        )
      })
      for (let i = 0; i < videosObj.length; i++) {
        const video = await videosObj[i].fetch()
        message.guild.musicData.queue.push(
          PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
        )
      }
      if (message.guild.musicData.isPlaying === false) {
        message.guild.musicData.isPlaying = true
        return PlayCommand.playSong(message.guild.musicData.queue, message)
      } else if (message.guild.musicData.isPlaying === true) {
        const PlayListEmbed = new MessageEmbed()
          .setColor('#5dc4ff')
          .setTitle(`${playlist.title}`)
          .addField(
            `Playlist has been added ${message.guild.musicData.queue.length} songs to queue!`,
            playlist.url
          )
          .setThumbnail(playlist.thumbnails.high.url)
          .setURL(playlist.url)
        message.say(PlayListEmbed)
        return
      }
    }

    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      query = query
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      const id = query[2].split(/[^0-9a-z_-]/i)[0]
      const video = await youtube.getVideoByID(id).catch(function () {
        return message.say(
          'There was a problem getting the video you provided!'
        )
      })
      message.guild.musicData.queue.push(
        PlayCommand.constructSongObj(video, voiceChannel, message.member.user)
      )
      if (
        message.guild.musicData.isPlaying === false ||
        typeof message.guild.musicData.isPlaying === 'undefined'
      ) {
        message.guild.musicData.isPlaying = true
        return PlayCommand.playSong(message.guild.musicData.queue, message)
      } else if (message.guild.musicData.isPlaying === true) {
        const addedEmbed = new MessageEmbed()
          .setColor('#5dc4ff')
          .setTitle(`:musical_note: ${video.title}`)
          .addField(
            'Has been added to queue. ',
            `This song is #${message.guild.musicData.queue.length} in queue`
          )
          .setThumbnail(video.thumbnails.high.url)
          .setURL(video.url)
        message.say(addedEmbed)
        return
      }
    }

    const videos = await youtube.searchVideos(query, 5).catch(function () {
      return message.say(
        'There was a problem searching the video you requested.'
      )
    })
    if (videos.length < 5) {
      return message.say(
        'I had some trouble finding what you were looking for, please try again or be more specific.'
      )
    }
    const songEmbed = await message.react('✅').then(function () {
      const videoIndex = parseInt(1)
      youtube
        .getVideoByID(videos[videoIndex - 1].id)
        .then(function (video) {
          message.guild.musicData.queue.push(
            PlayCommand.constructSongObj(
              video,
              voiceChannel,
              message.member.user
            )
          )
          if (message.guild.musicData.isPlaying === false) {
            message.guild.musicData.isPlaying = true
            if (songEmbed) {
              songEmbed.delete()
            }
            PlayCommand.playSong(message.guild.musicData.queue, message)
          } else if (message.guild.musicData.isPlaying === true) {
            if (songEmbed) {
              songEmbed.delete()
            }
            const qqew = new MessageEmbed()
              .setColor('#5dc4ff')
              .setTitle(`:musical_note: ${video.title}`)
              .addField(
                'Has been added to queue. ',
                `This song is #${message.guild.musicData.queue.length} in queue`
              )
              .setThumbnail(video.thumbnails.high.url)
              .setURL(video.url)
            message.say(qqew)
          }
        })
        .catch(function () {
          if (songEmbed) {
            songEmbed.delete()
          }
          return message.say(
            'An error has occured when trying to get the video ID from YouTube'
          )
        })
    })
  }

  static playSong (queue, message) {
    const classThis = this
    queue[0].voiceChannel
      .join()
      .then(function (connection) {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              quality: 'highestaudio',
              highWaterMark: 1024 * 1024 * 10
            })
          )
          .on('start', function () {
            message.guild.musicData.songDispatcher = dispatcher
            dispatcher.setVolume(message.guild.musicData.volume)

            const videoEmbed = new MessageEmbed()
              .setAuthor(
                ' Playing...',
                'https://i.postimg.cc/hjMVmyZm/giphy-1.gif'
              )
              .setTitle('')
              .setThumbnail(queue[0].thumbnail)
              .setColor('#5dc4ff')
              .setDescription(
                `**[${queue[0].title}](${queue[0].url})** \nDuration: **[${queue[0].duration}]** \nRequested by: **${queue[0].memberDisplayName}**`
              )
            if (queue[1]) {
              videoEmbed.addField(
                'Next Song:',
                `**[${queue[1].title}](${queue[1].url})** \nDuration: **[${queue[1].duration}]**`
              )
            }
            message.say(videoEmbed).then((msg) => {
              msg.react('▶').then((r) => {
                msg.react('⏸')
                msg.react('⏹')
                msg.react('❌')
                const backwardsFilter = (reaction, user) =>
                  reaction.emoji.name === '▶' && user.id === message.author.id
                const forwardsFilter = (reaction, user) =>
                  reaction.emoji.name === '⏸' && user.id === message.author.id
                const stopFilter = (reaction, user) =>
                  reaction.emoji.name === '⏹' && user.id === message.author.id
                const nextFilter = (reaction, user) =>
                  reaction.emoji.name === '❌' && user.id === message.author.id
                const backwards = msg.createReactionCollector(backwardsFilter)
                const forwards = msg.createReactionCollector(forwardsFilter)
                const stop = msg.createReactionCollector(stopFilter)
                const next = msg.createReactionCollector(nextFilter)
                backwards.on('collect', () => {
                  message.guild.musicData.songDispatcher.resume()
                  msg.reactions.resolve('▶').users.remove(message.author.id)
                  message.channel.send('▶ Resumed').then(async (message) => {
                    message.delete({ timeout: 2000 })
                  })
                })

                forwards.on('collect', () => {
                  message.guild.musicData.songDispatcher.pause()
                  msg.reactions.resolve('⏸').users.remove(message.author.id)
                  message.channel
                    .send('⏸ Song Paused')
                    .then(async (message) => {
                      message.delete({ timeout: 2000 })
                    })
                })
                stop.on('collect', () => {
                  message.guild.musicData.songDispatcher.resume()
                  message.guild.musicData.songDispatcher.end()
                  msg.reactions.resolve('⏹').users.remove(message.author.id)
                  message.channel
                    .send('⏹ Song Stopped.')
                    .then(async (message) => {
                      message.delete({ timeout: 2000 })
                    })
                })
                next.on('collect', () => {
                  message.guild.musicData.songDispatcher.resume()
                  message.guild.musicData.songDispatcher.end()
                  message.guild.musicData.queue.length = 0
                  msg.reactions.resolve('❌').users.remove(message.author.id)
                  message.channel
                    .send('❌ Stopping all song.')
                    .then(async (message) => {
                      message.delete({ timeout: 2000 })
                    })
                })
              })
            })
            message.guild.musicData.nowPlaying = queue[0]
            return queue.shift()
          })
          .on('finish', function () {
            if (queue.length >= 1) {
              return classThis.playSong(queue, message)
            } else {
              const embods = new MessageEmbed()
                .setDescription('The song/music has ended.')
                .setColor('#5dc4ff')
              message.say(embods)
              message.guild.musicData.isPlaying = false
              message.guild.musicData.nowPlaying = null
              message.guild.musicData.songDispatcher = null
              return message.guild.me.voice.channel.leave()
            }
          })
          .on('error', function (e) {
            message.say('Cannot play song')
            console.error(e)
            message.guild.musicData.queue.length = 0
            message.guild.musicData.isPlaying = false
            message.guild.musicData.nowPlaying = null
            message.guild.musicData.songDispatcher = null
            return message.guild.me.voice.channel.leave()
          })
      })
      .catch(function (e) {
        console.error(e)
        return message.guild.me.voice.channel.leave()
      })
  }

  static constructSongObj (video, voiceChannel, user) {
    let duration = this.formatDuration(video.duration)
    if (duration === '00:00') duration = ' Live Stream'
    return {
      url: `https://www.youtube.com/watch?v=${video.raw.id}`,
      title: video.title,
      rawDuration: video.duration,
      duration,
      thumbnail: video.thumbnails.high.url,
      voiceChannel,
      memberDisplayName: user.tag
    }
  }

  // prettier-ignore
  static formatDuration (durationObj) {
    const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      (durationObj.seconds < 10)
        ? ('0' + durationObj.seconds)
        : (durationObj.seconds
        ? durationObj.seconds
        : '00')
    }`
    return duration
  }
}