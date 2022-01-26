const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'transfer',
      group: 'currency',
      memberName: 'transfer',
      description: 'Tranfer 200 Coin to friend!!',
      guildOnly: true
    })
  }

  async run (message,args) {
   const member = message.mentions.members.first();
   const user = await mongoCurrency.findUser(message.member.id, message.guild.id);
   const mem = await mongoCurrency.findUser(member.id, message.guild.id);
   const amt = 200;
   if(user.coinsInWallet > amt){
   user.coinsInWallet -= amt;
   mem.coinsInWallet += amt;
      await mongoCurrency.giveCoins(member.id, message.guild.id, amt );
      message.reply(`You have transfered ${amt} Coins to <@!${member.id}>`); 
   }
   else{
     message.reply(`You don't have enough funds to transfer`);
   }
  }
}
