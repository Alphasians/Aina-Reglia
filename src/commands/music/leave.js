const { Command } = require('discord.js-commando')

module.exports = class LeaveCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'leave',
      aliases: ['end', 'disconnect'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves voice channel'
    })
  }

  async run (msg) {
    if (!msg.member.voice.channel) {
      return msg.say('Please, join in voice channel')
    }
    const connection = this.client.voice.connections.get(msg.guild.id)
    if (!connection) return msg.reply('I am not in a voice channel.')
    if (
      msg.guild.musicData.isPlaying === true &&
      msg.member.voice.channel.id !==
        this.client.voice.connections.get(msg.guild.id).voice.channelID
    ) {
      return msg.channel.send({
        embed: {
          description: `Error accepting you request, because you're not in **${msg.guild.musicData.nowPlaying.voiceChannel.name}** `,
          color: '#5dc4ff'
        }
      })
    }

    if (msg.guild.musicData.isPlaying === true) {
      msg.guild.musicData.songDispatcher.resume()
      msg.guild.musicData.songDispatcher.end()
      msg.guild.musicData.queue.length = 0
    } else {
      await connection.channel.leave()
      return msg.reply(`Left **${connection.channel.name}**...`)
    }
  }
}
