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
          prompt: 'Why do you want to unban this user',
          type: 'string'
        }
      ]
    })
  }

  run (message, { userTounBan, reason }) {
    message.guild.fetchBans()
    .then(bans => {
    let user = bans.find(banInfo => banInfo.user.id === userTounBan)
    if(!user) 
      return message.reply("The mentioned ID is not banned")
    message.guild
      .members.unban(userTounBan, reason)
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
    })
  }
}
