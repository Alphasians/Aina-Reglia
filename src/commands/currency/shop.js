const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const items = require('../../../models/shopItem.js')

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'shop',
      group: 'currency',  
      memberName: 'shop',
      description: 'List out the various things in the Shop.',
      guildOnly: true,
      /**
      *@param {String[]} args
      */
    })
  }

  async run (message,args) {
    if(items.length === 0) return message.reply("No item on Sale!");
    message.channel.send('The Items on sale are:-')
    const shopList = items.map((value,index)=>{
      return `**${index+1}** ${value.item} -> ${value.price} Coins!`
    })
    message.channel.send(shopList);
  }
  }

