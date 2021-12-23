const Logger = require('../utils/Logger')
const BaseManager = require('./BaseManager')
const fs = require('fs')
const path = require('path')

/**
 * @typedef {Object} executeOptions
 * @property {import('../structures/BotClient')} client
 * @property {import('discord.js').Message} message
 * @property {string[]} args
 */


/**
 * @extends {BaseManager}
 */
class CommandManager extends BaseManager {
  /**
   * Command Manager constructor
   * @param {import('../structures/BotClient')} client Bot client
   */
  constructor(client) {
    super(client)
    
    this.logger = new Logger('CommandManager')
    this.commands = client.commands
  }

  /**
   * Load commmands from a directory
   * @param {string} commandPath commandPath is the path to the folder containing the commands
   */
  async load(commandPath = path.join(__dirname, '../commands')) {
    this.logger.debug('Loading commands...')

    const commandFolder = fs.readdirSync(commandPath)

    try {
      commandFolder.forEach(folder => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              if (!commandFile.endsWith('.js')) return this.logger.warn(`Not a Javascript file ${commandFile}. Skipping.`)

              let command = require(`../commands/${folder}/${commandFile}`)

              if(!command.name) return this.logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.name, command)

              this.logger.debug(`Loaded command ${command.name}`)
            } catch (error) {
              this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
            }
          })
        } catch (error) {
          this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  /**
   * 
   * @param {string} commandName
   * @returns {import('../structures/BotClient').Command}
   */
  get(commandName) {
    if(this.client.commands.has(commandName))
      return this.client.commands.get(commandName)
    else if(this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) 
      return this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    
  }

  /**
   * reloading command
   * @param {string} commandPath 
   * @return {string|Error}
   */
  reload(commandPath = path.join(__dirname, '../commands')) {
    this.logger.debug('Reloading commands...')

    this.commands.clear()

    this.load(commandPath).then(() => {
      this.logger.debug('Succesfully reloaded commands.')
      return '[200] Succesfully reloaded commands.'
    })
  }

  /**
   * Slash Command setup tool
   * @param {import("discord.js").Snowflake} [guildID]
   * @returns {Promise<import('@discordjs/builders').SlashCommandBuilder[]>}
   */
  async slashCommandSetup(guildID) {
    this.logger.scope = 'CommandManager: SlashSetup'

    let slashCommands = []
    for (let command of this.client.commands) {
      if(command[1].isSlash || command[1].slash) {
        slashCommands.push(command[1].isSlash ? command[1].data : command[1].slash?.data)
      }
    }

    if(!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)
      
      this.client.application.commands.set(slashCommands).then((x) => {
        this.logger.info(`Succesfully set ${x.size} guilds`)
      })
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)

      let guild = this.client.guilds.cache.get(guildID)

      await guild.commands.set(slashCommands)

      return slashCommands
      
    }
  }
}

module.exports = CommandManager