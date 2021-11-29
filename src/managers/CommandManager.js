const Logger = require('../utils/Logger')
const BaseManager = require('./BaseManager')
const ErrorManager = require('./ErrorManager')
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

/**
 * @typedef {Object} executeOptions
 * @property {import('../structures/BotClient')} client
 * @property {import('discord.js').Message} message
 * @property {string[]} args
 */

const logger = new Logger('CommandManager')

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

    this.commands = client.commands
  }

  /**
   * Load commmands from a directory
   * @param {string} commandPath commandPath is the path to the folder containing the commands
   * @returns {import("discord.js").Collection<string, import('../structures/BotClient').Command>}
   */
  async load(commandPath = path.join(__dirname, '../commands')) {
    logger.debug('Loading commands...')

    const commandFolder = fs.readdirSync(commandPath)

    try {
      commandFolder.forEach(folder => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              if (!commandFile.endsWith('.js')) return logger.debug(`Not a Javascript file ${commandFile}. Skipping.`)

              let command = require(`../commands/${folder}/${commandFile}`)

              if(!command.name) return logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.name, command)

              logger.debug(`Loaded command ${command.name}`)
            } catch (error) {
              logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
              // eslint-disable-next-line no-unsafe-finally
              return this.commands
            }
          })
        } catch (error) {
          logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error) {
      logger.error('Error fetching folder list.\n' + error.stack)
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
   * @return {Error|string}
   */
  reload(commandPath = path.join(__dirname, '../commands')) {
    logger.debug('Reloading commands...')

    this.commands.clear()

    this.load(commandPath).then(() => {
      logger.debug('Succesfully reloaded commands.')
      return '[200] Succesfully reloaded commands.'
    })
  }

  /**
   * Slash Command setup tool
   * @param {Discord.Snowflake} [guildID]
   * @returns {number}
   */
  async slashCommandSetup(guildID) {
    let errorManager = new ErrorManager(this.client)

    logger.scope = 'CommandManager: SlashSetup'

    let slashCommands = []
    for (let command of this.client.commands) {
      if(command[1].isSlash || command[1].slash) {
        slashCommands.push(command[1].isSlash ? command[1].data : command[1].slash?.data)
      }
    }

    if(!guildID) {
      logger.warn('guildID not gived switching global command...')
      logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)
      this.client.guilds.cache.forEach(async guild => {
        try {
          guild.commands.set(slashCommands)

          return slashCommands.length
        } catch (error) {
          if(error.code === Discord.Constants.APIErrors.MISSING_ACCESS) return logger.warn(`Missing access to ${guild.name}`)

          errorManager.report(error)
        }

        logger.debug(`Succesfully set commands for ${guild.name}`)

      })
    } else {
      logger.info(`Slash Command requesting ${guildID}`)
      try {
        let guild = this.client.guilds.cache.get(guildID)

        guild.commands.set(slashCommands)

        return slashCommands.length
      } catch (error) {
        if(error.code === Discord.Constants.APIErrors.MISSING_ACCESS) return Discord.Constants.APIErrors.MISSING_ACCESS
        errorManager.report(error)
      }
      
    }
  }
}

module.exports = CommandManager