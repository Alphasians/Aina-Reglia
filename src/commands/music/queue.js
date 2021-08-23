const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')

module.exports = class QueueCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'queue',
      aliases: ['song-list', 'next-songs'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'Display the song queue'
    })
  }

  run (message) {
    if (message.guild.musicData.queue.length === 0) { return message.say('There are no songs in queue!') }
    const titleArray = []
    /* eslint-disable */
    // display only first 10 items in queue
    message.guild.musicData.queue.slice(0, 10).forEach((obj) => {
      titleArray.push(obj.title);
    });
    /* eslint-enable */
    const queueEmbed = new MessageEmbed()
      .setColor('#5dc4ff')
      .setTitle(`Music Queue - ${message.guild.musicData.queue.length} items`)
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`)
    }
    return message.say(queueEmbed)
  }
}
