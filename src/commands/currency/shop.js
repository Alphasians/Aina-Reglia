const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'shop',
      group: 'currency',  
      memberName: 'shop',
      description: 'List out the various things in the Shop.',
      guildOnly: true,
    })
  }

  async run (message) {
    const shop = new MessageEmbed()
      .setTitle('Welcome to the Guild Shop')
      .setColor('#0099ff')
      .addFields(
        { name: 'Pet Bird', value: '8XvZ1j', inline: true  },
        { name: 'Pet Cat', value: '2Bf2zW', inline: true  },
        { name: 'Pet Dog', value: 'hErmEm', inline: true  },
        { name: 'House', value: '2Erf5m' }
    );
    message.channel.send(shop);
   }
  }
