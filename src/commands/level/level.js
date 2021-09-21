const { Command } = require('discord.js-commando')
const { Levels } = require('discord-xp')
module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'level',
      aliases: ['lvl'],
      memberName: 'level',
      group: 'level',
      description: 'Returns a level of the person',
      guildOnly: true
    })
  }

  async run (message, args, client) {
    const mentionedMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0])
    const member = await Levels.fetch(mentionedMember.user.id, message.guild.id)
    if (!member) {
      return message.channel.send('Member has not started yet!')
    }
    try {
      message.channel.send(`${mentionedMember.user.tag} is level ${member.level} has ${member.xp}`)
    } catch (err) {
      return console.error(err)
    }
  }
}
