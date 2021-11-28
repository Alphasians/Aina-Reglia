const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')

Levels.setURL(process.env.mongoPath)

module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'profile',
      memberName: 'profile',
      group: 'misc',
      description: 'Check your user profile and stats',
      guildOnly: true
    })
  }

  async run (message) {
    const ProfileCard = new MessageEmbed()
    .setTitle(`Profile for ${message.author.tag}`)
    .setThumbnail(message.author.displayAvatarURL())
    .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
    .setColor('#00ff00')
    .setDescription(`Profile and stats for ${message.author.tag}`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .addFields([
      { name: 'Level', value: (await Levels.fetch(message.author.id, message.guild.id)).level, inline: true },
      { name: 'XP', value: (await Levels.fetch(message.author.id, message.guild.id)).xp, inline: true },
      { name: 'Last seen at', value: (await Levels.fetch(message.author.id, message.guild.id)).lastUpdated, inline: false }
    ])
    message.say(ProfileCard)
  }
}
