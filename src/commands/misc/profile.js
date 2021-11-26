const { Command } = require('discord.js-commando')
const { MessageEmbed, Message } = require('discord.js')
const Levels = require('discord-xp').default

Levels.setURL(process.env.mongoPath)

module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'profile',
      aliases: [],
      memberName: 'profile',
      group: 'misc',
      description: 'Check your user profile and stats',
      guildOnly: true
    })
  }

  async run (message) {
    const embed = new MessageEmbed()

    embed.setTitle(`Profile for ${message.author.tag}`)
    embed.setThumbnail(message.author.displayAvatarURL())
    embed.setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
    embed.setColor('#00ff00')
    embed.setDescription(`Profile and stats for ${message.author.tag}`)
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    embed.setTimestamp()
    embed.addFields([
      { name: 'Level', value: (await Levels.fetch(message.author.id, message.guild.id)).level, inline: true },
      { name: 'XP', value: (await Levels.fetch(message.author.id, message.guild.id)).xp, inline: true },
      { name: 'Last seen at', value: (await Levels.fetch(message.author.id, message.guild.id)).lastUpdated, inline: false }
    ])
  }
}
