const { Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')
const Logger = require('@class/Logger')
const { pathToFileURL } = require('url')
/**
 * @type {import('../structures/Logger')}
 */
const logger = new Logger('CommandManager')

class CommandManager {
  constructor(client) {
    this.client = client
    /**
     * @type {Collection<string, Command>}
     */
    this.commands = new Collection()

    /**
     * @type {Collection<string, string>}
     */
    this.aliases = new Collection()

  }

  /**
   * Load commmands from a directory
   * @param {string} commandPath commandPath is the path to the folder containing the commands
   * @returns {void}
   */
  async loadCommands(commandPath = path.join(__dirname, '../commands')) {
    const commandFolder = fs.readdirSync(commandPath)

    try {
      commandFolder.forEach(folder => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              if (!commandFile.endsWith('.js')) return logger.debug(`Not a Javascript file ${commandFile}. Skipping.`)

              const command = require(`@commands/${commandFolder}/${commandFile}`)

              this.commands.set(command.name, command)
              this.aliases.set(command.name, command.name)

              logger.debug(`Loaded command ${command.name}`)
            } catch (error) {
              logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            }
          })
        } catch (error) {
          logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error) {
      logger.error(`Error fetching folder list.\n` + error.stack)
    }
  }

  getCommand(command) {
    if (this.commands.has(command)) {
      return this.commands.get(command)
    } else if (this.aliases.has(command)) {
      return this.commands.get(this.aliases.get(command))
    }
    return null
  }

  reloadCommands(commandPath = path.join(__dirname, '../commands')) {
    logger.debug('Reloading commands...')

    this.commands.clear()
    this.aliases.clear()

    this.loadCommands(commandPath).then(() => {
      logger.debug('Commands reloaded!')
    })
  }
}

module.exports = CommandManager