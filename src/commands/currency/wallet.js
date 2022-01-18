const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'wallet',
      group: 'currency',
      memberName: 'currency',
      description: 'Deposit money to bank',
      guildOnly: true
    })
  }

  async run (message) {
    const member = message.mentions.members.first() || message.member;
    const user = await mongoCurrency.findUser(member.id, message.guild.id);
    const embed = new MessageEmbed()
    .setTitle(`${member.user.username}'s Balance`)
    .setDescription(`Wallet: ${user.coinsInWallet}`);
    
    message.channel.send(embed);
  }
}
