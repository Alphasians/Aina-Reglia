const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class ResumeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'resume',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Resume the current paused song',
      guildOnly: true
    })
  }

  run (message) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.reply('Join a channel and try again')

    if (
      typeof message.guild.musicData.songDispatcher === 'undefined' ||
      message.guild.musicData.songDispatcher === null
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
      const embed = new MessageEmbed()
        .setColor('#5dc4ff')
        .setTitle(':play_pause: Resumed')
        .setDescription('✔ | Successfully resumed song')
      message.say(embed)
      message.guild.musicData.songDispatcher.resume()
    } else {
      message.channel.send(
        'You can only execute this command if you share the same voiceChannel!'
      )
    }
  }
}
