const { Client, Collection } = require('discord.js')
const fs = require('node:fs')
const path = require('path')
const Dokdo = new require('dokdo')
const Logger = require('../utils/Logger')

const config = require('../../config')
const logger = new Logger('bot')


/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {string} description
 * @property {string} usage
 * @property {string[]} aliases
 * @property {boolean} [isSlash]
 * @property {import('@discordjs/builders').SlashCommandBuilder} [data]
 * @property {void} execute
 * @property {Object} [slash]
 * @property {string} slash.name
 * @property {string} slash.description
 * @property {import('@discordjs/builders').SlashCommandBuilder} slash.data
 * @property {void} slash.execute
 */

/**
 * @typedef {Object} Event
 * @property {string} name
 * @property {boolean} [once]
 * @property {void} execute
 */

/**
 * @typedef {string} Error
 */

/**
 * @typedef {Object} BuildOptions
 * @property {string} VERSION
 * @property {string} NUMBER
 */
/**
 * Discord Bot Client
 * @extends {Client}
 */
class BotClient extends Client {
  /**
   * BotClient constructor
   * @param {import('discord.js').ClientOptions} options Discord client options
   * @param {BuildOptions} BUILD
   */
  constructor(options = { parse: ['users', 'roles'], repliedUser: false }, BUILD) {
    super(options)

    logger.info('Loading config data...')

    this.VERSION = BUILD.VERSION
    this.BUILD_NUMBER = BUILD.NUMBER

    if (fs.existsSync(path.join(path.resolve(), 'config.js'))) {
      this.config = require('../../config')
      logger.info('Config data loaded.')
    } else {
      logger.fatal('Config file not found!')
    }

    /**
     * @type {Collection<string, Command>}
     */
    this.commands = new Collection()

    /**
     * @type {Collection<string, Event>}
     */
    this.events = new Collection()
    
    /**
     * @type {Collection<string, Error>}
     */
    this.errors = new Collection()

    /**
     * @type {Dokdo}
     */
    this.dokdo = new Dokdo(this, { prefix: this.config.bot.prefix })

    /**
     * @type {import('mongoose')|import('quick.db')}
     */
    this.db
    /**
     * @type {Collection<string, import('mongoose').Model>}
     */
    this.schemas = new Collection()

    this._maxListeners = Infinity
  }

  /**
   * Loggin in the bot
   * @param {string} token Discord bot token
   */
  async start(token = config.bot.token) {
    logger.info('Logging in bot...')
    await this.login(token)
  }

  /**
   * Setting status
   * @param {string} status 
   */
  async setStatus(status = 'online', name = '점검중...') {
    if(status.includes('dev')) {
      logger.warn('Changed status to Developent mode')

      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION} : ${name}` }
        ], 
        status: 'dnd'
      })
    } else if(status.includes('online')) {
      logger.info('Changed status to Online mode')
      
      this.user?.setPresence({
        activities: [
          { name: `${this.config?.prefix}help | ${this.VERSION}` }
        ],
        status: 'online'
      })
    }
  }

}

module.exports = BotClient