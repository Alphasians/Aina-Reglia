const Levels = require('discord-xp')

module.exports = {
  name: 'message',
  execute (message, client) {
    if (message.author.bot) return
    if (message.channel.type === 'dm') return

    const randomXP = Math.floor(Math.random() * 29) + 1
    const hasLeveledUP = Levels.appendXp(message.author.id, message.guild.id, randomXP)
    if (hasLeveledUP) {
      const user = Levels.fetch(message.author.id, message.guild.id)
      message.channel.send(`${message.member} leveled up to ${user.level}`)
    }
    if (!message.content.startsWith(client.prefix)) return

    const args = message.content.slice(client.prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName)
    try {
      command.execute(message, args, client)
    } catch (err) {
      console.log(err)
    }
  }
}
