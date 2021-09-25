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
    const mentionedMember =
      message.mentions.members.first() ||
      message.author
    const member = await Levels.fetch(mentionedMember.id, message.guild.id)
    if (!member) {
      return message.channel.send('Member has not started yet!')
    }
    try {
      const user = await Levels.fetch(mentionedMember.id, message.guild.id)
      const rank = new MessageEmbed()
        .setColor('#EF534A')
        .setTitle('Leveled')
        .setDescription(`<@!${mentionedMember.id}> level is ${user.level}`)
      message.say(rank)
    } catch (err) {
      return console.error(err)
    }
  }
}
