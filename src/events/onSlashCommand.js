const Discord = require('discord.js')
const CommandManager = require('../managers/CommandManager')
const Logger = require('../utils/Logger')
const ErrorManager = require('../managers/ErrorManager')

module.exports = {
  name: 'interactionCreate',
  /**
   * 
   * @param {import('../structures/BotClient')} client 
   * @param {Discord.CommandInteraction} interaction 
   */
  async execute(client, interaction) {
    if(!interaction.isCommand()) return
    /**
     * @type {import('../managers/CommandManager')}
     */
    let commandManager = new CommandManager(client)
    /**
      * @type {import('../managers/ErrorManager')}
      */
    let errorManager = new ErrorManager(client)

    if(interaction.user.bot) return
    if(interaction.channel.type === 'DM') return interaction.reply('DM으로는 명령어 사용이 불가능해요')

    let command = commandManager.get(interaction.commandName)

    try {
      command.isSlash ? await command.execute(client, interaction) : await command.slash.execute(client, interaction)
    } catch (error) {
      errorManager.report(error, interaction)
    }

  }
}