const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class BanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unban',
      aliases: ['unban-member', 'unban-prick'],
      memberName: 'unban',
      group: 'moderation',
      description: 'UnBans a tagged member',
      guildOnly: true,
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [
        {
          key: 'userTounBan',
          prompt:
            'Please mention the user you want to ban with @ or provide his ID',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Why do you want to ban this user',
          type: 'string'
        }
      ]
    })
  }

  run (message, { userTounBan, reason }) {
    const user =
      message.mentions.members.first() ||
      message.guild.members.fetch(userTounBan)

    if (user === undefined) { return message.channel.send('Please try again with a valid user') }
    const member = message.guild.members.resolve(user)
    member
      .bans.remove(reason)
      .then(() => {
        const unbanEmbed = new MessageEmbed()
          .addField('UnBanned:', userTounBan)
          .addField('Reason', reason)
          .setColor('#420626')
        message.channel.send(unbanEmbed)
      })
      .catch((e) => {
        message.say(
          'Something went wrong when trying to ban this user, I probably do not have the permission to ban him'
        )
        return console.error(e)
      })
  }
}
