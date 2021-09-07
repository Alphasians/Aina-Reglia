const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')

module.exports = class BanCommand extends Command {
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

  run (message, args, client) {
    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0])
    if (user === undefined) { return message.channel.send('Please try again with a valid user') }
    const member = message.guild.members.resolve(user)
    member
      .ban({ days: 7, reason: 'your reason here' })
      .then(() => {
        const banEmbed = new MessageEmbed()
          .addField('Banned:')
          .addField('Reason')
          .setColor('#1900ff')
        message.channel.send(banEmbed)
      })
      .catch((e) => {
        message.say(
          'Something went wrong when trying to ban this user, I probably do not have the permission to ban him'
        )
        return console.error(e)
      })
  }
}
