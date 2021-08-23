const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')

module.exports = class NowPlayingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'nowplaying',
      group: 'music',
      memberName: 'nowplaying',
      aliases: ['np', 'currently-playing', 'now-playing'],
      guildOnly: true,
      description: 'Display the currently playing song'
    })
  }

  run (message) {
    try {
      if (
        !message.guild.musicData.isPlaying &&
        !message.guild.musicData.nowPlaying
      ) {
        return message.say('There is no song playing right now!')
      }

      const video = message.guild.musicData.nowPlaying
      let description
      if (video.duration === 'Live Stream') {
        description = 'Live Stream'
      } else {
        description = NowPlayingCommand.playbackBar(message, video)
      }
      const pict = 'https://i.postimg.cc/QtqvTDrq/giphy.gif'
      const videoEmbed = new MessageEmbed()
        .setAuthor('Now Playing', pict)
        .setColor('#5dc4ff')
        .setTitle(video.title)
        .setDescription(description)
      message.channel.send(videoEmbed)
    } catch (e) {
      message.say('Are u sure, you already play some song?')
    }
  }

  static playbackBar (message, video) {
    const passedTimeInMS = message.guild.musicData.songDispatcher.streamTime
    const passedTimeInMSObj = {
      seconds: Math.floor((passedTimeInMS / 1000) % 60),
      minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
      hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24)
    }
    const passedTimeFormatted =
      NowPlayingCommand.formatDuration(passedTimeInMSObj)

    const totalDurationObj = video.rawDuration
    const totalDurationFormatted =
      NowPlayingCommand.formatDuration(totalDurationObj)

    let totalDurationInMS = 0
    Object.keys(totalDurationObj).forEach(function (key) {
      if (key === 'hours') {
        totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 3600000
      } else if (key === 'minutes') {
        totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 60000
      } else if (key === 'seconds') {
        totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 100
      }
    })
    const playBackBarLocation = Math.round(
      (passedTimeInMS / totalDurationInMS) * 10
    )
    let playBack = ''
    for (let i = 1; i < 20; i++) {
      if (playBackBarLocation === 0) {
        playBack = 'ðŸŸ¡â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬â–¬'
        break
      } else if (i === playBackBarLocation * 2) {
        playBack = playBack + 'ðŸŸ¡'
      } else {
        playBack = playBack + 'â–¬'
      }
    }
    playBack = `${passedTimeFormatted}  ${playBack}  ${totalDurationFormatted}`
    return playBack
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
