const Discord = require('discord.js')
const CommandManager = require('@manager/CommandManager')
const Logger = require('@utils/Logger')
const ErrorManager = require('@manager/ErrorManager')

let logger = new Logger('Event: messageCreate')

module.exports = {
  name: 'messageCreate',
  /**
   * @param {import('../structures/BotClient')} client 
   * @param {Discord.Message} message 
   */
  async execute(client, message) {
    /**
     * @type {import('../managers/CommandManager')}
     */
    let commandManager = new CommandManager(client)
    /**
     * @type {import('../managers/ErrorManager')}
     */
    let errorManager = new ErrorManager(client)

    if (message.author.bot) return
    if (message.channel.type === 'DM') return
    if (!message.content.startsWith(client.config.bot.prefix)) return

    let args = message.content.slice(client.config.bot.prefix.length).trim().split(/ +/g)
    let commandName = args.shift().toLowerCase()
    let command = commandManager.get(commandName)
    
    await client.dokdo.run(message)

    try {
      await command?.execute(client, message, args)
    } catch (error) {
      errorManager.report(error, message)
    }
  }
}