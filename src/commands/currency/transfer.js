const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency')

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'transfer',
      group: 'currency',  
      memberName: 'transfer',
      description: 'Tranfer 200 Coin to friend!!',
      guildOnly: true,
      args: [
        {
          key: 'recipient',
          type: 'member',
          prompt: 'Whom do you want to send the money to?'
        },
        {
          key: 'amount',
          type: 'float',
          prompt: 'How much money do you want to sent?'
        }
      ]
    })
  }

  async run (message, args) {
   const member = args.recipient
   const user = await mongoCurrency.findUser(message.member.id, message.guild.id)
   const recipient = await mongoCurrency.findUser(member.id, message.guild.id)
   const amt = args.amount

   if (user.coinsInWallet >= amt){
      await mongoCurrency.giveCoins(member.id, message.guild.id, amt )
      await mongoCurrency.deductCoins(message.member.id, message.guild.id, amt)
      message.reply(`You have transfered ${amt} Coins to <@!${member.id}>`)
   }
   else {
     message.reply(`You don't have enough funds to transfer`)
   }
  }
}
