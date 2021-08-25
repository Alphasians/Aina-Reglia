const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class PauseCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'pause',
      aliases: ['pause-song', 'hold', 'stop'],
      memberName: 'pause',
      group: 'music',
      description: 'Pause the current playing song',
      guildOnly: true
    })
  }

  run (message) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.reply('Join a channel and try again')
    if (
      typeof message.guild.musicData.songDispatcher === 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.say('There is no song playing right now!')
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
      message.guild.musicData.songDispatcher.pause()
      const embed = new MessageEmbed()
        .setColor('#5dc4ff')
        .setTitle('⏸ Song Paussed')
        .addField('✔ | Successfully Pause', `**${message.guild.musicData.nowPlaying.title}**`)
      message.say(embed)
    } else {
      message.channel.send('You can only execute this command if you share the same voice Channel!')
    }
  }
}
