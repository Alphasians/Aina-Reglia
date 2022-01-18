const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect(process.env.mongoPath)

let claimedUser = []

const clearCache = () => {
  claimedUser = []
  setTimeout(clearCache,1000 * 60 *60)
}
clearCache()

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'coin',
      group: 'currency',
      memberName: 'coin',
      description: 'Get the money',
      guildOnly: true
    })
  }

  async run (message) {
    const randomCoins = Math.floor(Math.random() * 99) + 1;
    if (claimedUser.includes(message.member.id)){
     message.reply(`You have already received! Wait for 1 hour`) 
    }
    else{
      await mongoCurrency.giveCoins(message.member.id, message.guild.id, randomCoins);
      message.reply(`You earned ${randomCoins} Coins`); 
      claimedUser.push(message.member.id);
    } 
  }
}
