const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const inventory = require('../../../models/inventory.js')
const items = require('../../../models/shopItem.js')
const mongoCurrency = require('discord-mongo-currency');
const mongoose = require('mongoose')
mongoose.connect(process.env.mongoPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true})
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

mongoCurrency.connect(process.env.mongoPath)

module.exports = class Economy extends Command {
  constructor (client) {
    super(client, {
      name: 'buy',
      group: 'currency',  
      memberName: 'buy',
      description: 'Buy from the shop!!',
      guildOnly: true,
      args: [
        {
          key: 'shopitem',
          type: 'string',
          prompt: 'Whom do you want to send the money to?'
        }]
    })
  }

  async run (message, args) {
    console.log(args.shopitem)
    if(!args.shopitem === 0) 
     return message.channel.send("Please Specify Item to buy!");
    
   const itemTobuy = args.shopitem ;
   
    const validItem = !!items.find((val) => val.item.toLowerCase() === itemTobuy);
   if(!validItem) return message.reply("Item is invalid to be bought!");

    const itemPrice = items.find((val) => (val.item.toLowerCase()) === itemTobuy).price;
    console.log(itemPrice);
    
    const member = message.member;
    const user = await mongoCurrency.findUser(member.id, message.guild.id);

    if(user.coinsInWallet < itemPrice)
      return message.reply(`You only have ${user.coinsInWallet} Coins, and the price of item is ${itemPrice} Coins`);

    const params = {
      Guild : message.guild.id,
      User : message.author.id
    }
      inventory.findOne(params, async(err,data)=>{
      if(data){
        const hasItem = Object.keys(data.Inventory).includes(itemTobuy);
        if(!hasItem){
          data.Inventory[itemTobuy]=1;
        }
        else{
          data.Inventory[itemTobuy]++;
        }
        console.log(data);
        await inventory.findOneAndUpdate(params,data).exec();
      }
      else{
        new inventory({
          Guild: message.guild.id,
          User: message.author.id,
          Inventory: {
            [itemTobuy]:1
          }
        }).save();
      }
      await mongoCurrency.deductCoins(message.member.id, message.guild.id, itemPrice );
      message.reply(`You have bought ${itemTobuy}`)
      })
  }
}