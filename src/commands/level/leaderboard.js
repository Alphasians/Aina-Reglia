const { Command } = require('discord.js-commando')
const { Client, MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')
const client = new Client()
Levels.setURL(process.env.mongoPath)

module.exports = class Level extends Command {
  constructor (client) {
    super(client, {
      name: 'leaderboard',
      memberName: 'leaderboard',
      group: 'level',
      description: 'Returns a leaderboard',
      guildOnly: true
    })
  }

  async run (message) {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id,10)
    if (rawLeaderboard.length < 1){
      return message.channel.send("Noone is on the leaderboard yet.")
    }
    try {
      const leaderboard = await Levels.computeLeaderboard(message.client, rawLeaderboard,true)
      const lb = leaderboard.map(e => `**${e.position}.${e.username}#${e.discriminator}** is Level: ${e.level} with XP: ${e.xp.toLocaleString()}`)
      const Cleaderboard = new MessageEmbed()
        .setColor('#0099FF')
        .setTitle('Leaderboard')
        .setDescription(`${lb.join("\n")}`)
      message.say(Cleaderboard)
    } catch (err) {
      return console.error(err)
    }
  }
}
