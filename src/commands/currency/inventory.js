const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const inventory = require('../../../models/inventory.js')
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'inventory',
      group: 'currency',  
      memberName: 'inventory',
      description: 'See the inventory!',
      guildOnly: true,
      aliases: ['inv'],
    })
  }

  async run (message) {
   inventory.findOne({Guild: message.guild.id, User: message.author.id}, async(err,data)=>{
     if(!data) return message.channel.send(`Your Inventory is empty!`);
     const mappedData = Object.keys(data.Inventory)
       .map((key)=>{
         return `${key}(${data.Inventory[key]})`;
       })
     .join(", ")
     message.channel.send(mappedData);
       })
  }
}