const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency')

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'coin',
      group: 'currency',
      memberName: 'coin',
      description: 'Get the money',
      guildOnly: true,
      throttling: {
        usages:1,
        duration: 3600,
    }
    })
  }

  async run (message) {
    const randomCoins = Math.floor(Math.random() * 99) + 1
      await mongoCurrency.giveCoins(message.member.id, message.guild.id, randomCoins)
      message.reply(`You earned ${randomCoins} Coins`)
  }
}
