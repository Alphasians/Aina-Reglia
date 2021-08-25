const { Command } = require('discord.js-commando')

module.exports = class VolumeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'volume',
      aliases: ['change-volume', 'vol'],
      group: 'music',
      memberName: 'volume',
      guildOnly: true,
      description: 'Adjust song volume',
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'wantedVolume',
          prompt: 'What volume would you like to set? from 1 to 200',
          type: 'integer',
          validate: wantedVolume => wantedVolume >= 1 && wantedVolume <= 200
        }
      ]
    })
  }

  run (message, { wantedVolume }) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.reply('Join a channel and try again')

    if (
      typeof message.guild.musicData.songDispatcher === 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('There is no song playing right now!')
    }
    if (!message.guild.voice.connection) {
      return
    }
    const userVoiceChannel = message.member.voice.channel
    if (!userVoiceChannel) {
      return
    }
    const clientVoiceConnection = message.guild.voice.connection
    if (userVoiceChannel === clientVoiceConnection.channel) {
      const volume = wantedVolume / 100
      message.guild.musicData.volume = volume
      message.guild.musicData.songDispatcher.setVolume(volume)
      message.say(`Current volume is: ${wantedVolume}%`)
    } else {
      message.channel.send('You can only execute this command if you share the same voiceChannel!')
    }
  }
}
