const fs = require('fs')
const path = require('path')
const Logger = require('@utils/Logger')
const BaseManager = require('./BaseManager')

/**
 * @type {import('../utils/Logger')}
 */
const logger = new Logger('CommandManager')

/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {string} description
 * @property {string} usage
 * @property {string[]} aliases 
 * @property {void} execute
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

    this.commands = client.commands
    this.aliases = client.aliases

  }

  /**
   * Load commmands from a directory
   * @param {string} commandPath commandPath is the path to the folder containing the commands
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

              let command = require(`@commands/${commandFolder}/${commandFile}`)

              if(!command.name) return logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.name, command)

              logger.debug(`Loaded command ${command.name}`)
            } catch (error) {
              logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
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
   * @returns {null|Command}
   */
  get(commandName) {
    if (this.commands.has(commandName)) {
      return this.commands.get(commandName)
    } else {
      this.commands.forEach(commandData => {
        console.log(commandName)
        console.log(commandData)
        if (commandData.aliases.includes(commandName)) return commandData
        
      })
    }
    return null
  }

  reload(commandPath = path.join(__dirname, '../commands')) {
    logger.debug('Reloading commands...')

    this.commands.clear()

    this.load(commandPath).then(() => {
      logger.debug('Succesfully reloaded commands.')
    })
  }
}

module.exports = CommandManager