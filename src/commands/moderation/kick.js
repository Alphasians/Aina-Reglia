const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class KickCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'kick',
      aliases: ['kick-member', 'throw'],
      memberName: 'kick',
      group: 'moderation',
      description: 'Kicks a tagged member',
      guildOnly: true,
      userPermissions: ['KICK_MEMBERS'],
      clientPermissions: ['KICK_MEMBERS'],
      args: [
        {
          key: 'userToKick',
          prompt: 'Who do you want to kick?',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Why do you want to kick this user',
          type: 'string'
        }
      ]
    })
  }

  run (message, { userToKick, reason }) {
    const user =
      message.mentions.members.first() ||
      message.guild.members.fetch(userToKick)
    if (user === undefined) { return message.channel.send('Please try again with a valid user') }
    user
      .kick(reason)
      .then(() => {
        const kickEmbed = new MessageEmbed()
          .addField('Kicked:', userToKick)
          .addField('Reason:', reason)
          .setColor('#ff0000')
        message.channel.send(kickEmbed)
      })
      .catch((e) => {
        message.say(
          'Something went wrong when trying to kick this user, I probably do not have the permission to kick him'
        )
        return console.error(e)
      })
  }
}
