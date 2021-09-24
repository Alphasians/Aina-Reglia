const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')

Levels.setURL(process.env.mongoPath)

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
    const randomXP = Math.floor(Math.random() * 29) + 1
    const hasLeveledUP = await Levels.appendXp(message.author.id, message.guild.id, randomXP)
    if (hasLeveledUP) {
      const user = Levels.fetch(message.author.id, message.guild.id)
      message.channel.send(`${message.member} leveled up to ${user.level}`)
    }
    const mentionedMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0])
    const member = await Levels.fetch(mentionedMember.user.id, message.guild.id)
    if (!member) {
      return message.channel.send('Member has not started yet!')
    }
    try {
      const user = await Levels.fetch(message.author.id, message.guild.id)
      const rank = new MessageEmbed()
        .setColor('#EF534A')
        .setTitle('LeveledUP')
        .setDescription(`${message.member} level is ${user.level}`)
      message.say(rank)
    } catch (err) {
      return console.error(err)
    }
  }
}
