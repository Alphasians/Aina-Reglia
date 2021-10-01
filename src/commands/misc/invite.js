const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')

Levels.setURL(process.env.mongoPath)

module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      aliases: [],
      memberName: 'invite',
      group: 'misc',
      description: 'Sends a invite for the bot',
      guildOnly: false
    })
  }

  async run (message) {
    message.reply('You can invite me to any server using this links \:D https://discord.com/oauth2/authorize?client_id=863982360282529798&permissions=8&scope=bot')
  }
}
