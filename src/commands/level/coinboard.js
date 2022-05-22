const { Command } = require('discord.js-commando')
const { Client, MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency');

const client = new Client();

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'coinboard',
      memberName: 'coinboard',
      group: 'currency',
      description: 'Returns a coin leaderboard',
      guildOnly: true
    })
  }

  async run (message) {
         const leaderboard = await mongoCurrency.generateLeaderboard(message.guild.id, 10);
    
    if (leaderboard.length < 1) return message.channel.send("Nobody's on the leaderboard.");
    const mappedLeaderboard = leaderboard.map(i => `<@!${i.userId}>- ${i.coinsInWallet}`);
  
  const embed = new MessageEmbed()
        .setColor('#0099FF')
        .setTitle('Leaderboard')
    .setTitle(`${message.guild.name}\'s Economy Leaderboard`)
 .setDescription(`${mappedLeaderboard.join('\n')}`);
    
    message.channel.send(embed);
  }
}
