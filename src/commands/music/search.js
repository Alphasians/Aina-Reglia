const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Youtube = require('simple-youtube-api')
const youtube = new Youtube(process.env.YOUTUBE_TOKEN)
const PlayCommand = require('./play.js')

module.exports = class SpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'search',
      aliases: ['s', 'add', 'add-song', 'choose'],
      memberName: 'search',
      group: 'music',
      description: 'Search song from youtube, but choosing.',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'query',
          prompt:
            'What song or playlist would you like to listen to? \n Just write the song in down bellow, without prefix',
          type: 'string',
          validate: function (query) {
            return query.length > 0 && query.length < 200
          }
        }
      ]
    })
  }

  async run (message, { query }) {
    // if (message.author.id !== '271576733168173057') return message.say('Sorry, music command is being rewritten :(');
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
          description: `Error accept you request, because you are not in **${message.guild.musicData.nowPlaying.voiceChannel.name}** `,
          color: 'RED'
        }
      })
    }

    const videos = await youtube.searchVideos(query, 5).catch(function () {
      return message.say(
        'There was a problem searching the video you requested.'
      )
    })
    if (videos.length < 5) {
      return message.say(
        'I had some trouble finding what you were looking for, please try again or be more specific'
      )
    }
    const vidNameArr = []
    for (let i = 0; i < videos.length; i++) {
      vidNameArr.push(`${i + 1}: [${videos[i].title}](${videos[i].shortURL})`)
    }
    vidNameArr.push('exit')
    const embed = new MessageEmbed()
      .setColor('#5dc4ff')
      .setTitle(':mag: Search Results!')
      .addField(':notes: Result 1', vidNameArr[0])
      .setURL(videos[0].url)
      .addField(':notes: Result 2', vidNameArr[1])
      .addField(':notes: Result 3', vidNameArr[2])
      .addField(':notes: Result 4', vidNameArr[3])
      .addField(':notes: Result 5', vidNameArr[4])
      .setThumbnail(videos[0].thumbnails.high.url)
      .setFooter('Choose a song by commenting a number between 1 and 5')
      .addField(':x: Exit', 'exit ')
    const songEmbed = await message.channel.send({ embed })
    message.channel
      .awaitMessages(
        function (msg) {
          return (msg.content > 0 && msg.content < 6) || msg.content === 'exit'
        },
        {
          max: 1,
          time: 60000,
          errors: ['time']
        }
      )
      .then(function (response) {
        const videoIndex = parseInt(response.first().content)
        if (response.first().content === 'exit') return songEmbed.delete()
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
                .setColor(0x5dc4ff)
                .setTitle(`:musical_note: ${video.title}`)
                .addField(
                  'Has been added to queue. ',
                  `This song is #${message.guild.musicData.queue.length} in queue`
                )
              message.say(qqew)
            }
          })
          .catch(function () {
            if (songEmbed) {
              songEmbed.delete()
            }
            return message.say(
              'An error has occured when trying to get the video ID from youtube'
            )
          })
      })
      .catch(function () {
        if (songEmbed) {
          songEmbed.delete()
        }
        return message.say(
          'Please try again and enter a number between 1 and 5 or exit'
        )
      })
  }
}
