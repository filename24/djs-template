const { Client, Collection } = require('discord.js')
const Dokdo = new require('dokdo')
const Logger = require('../utils/Logger')
const { config } = require('dotenv')

const CommandManager = require('../managers/CommandManager')
const EventManager = require('../managers/EventManager')
const DatabaseManager = require('../managers/DatabaseManager')

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
 * Discord Bot Client
 * @extends {Client}
 */
class BotClient extends Client {
  /**
   * BotClient constructor
   * @param {import('discord.js').ClientOptions} options Discord client options
   */
  constructor(options = { parse: ['users', 'roles'], repliedUser: false }) {
    super(options)

    config()
    this.config = require('../../config')
    
    this.VERSION = this.config.BUILD_VERSION
    this.BUILD_NUMBER = this.config.BUILD_NUMBER
    
    /**
     * @type {Collection<string, Command>}
     */
    this.commands = new Collection()

    /**
     * @type {Collection<string, string[]>}
     */
    this.categorys = new Collection()

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

    /**
     * @type {CommandManager}
     */
    this.command = new CommandManager(this)
  
    /**
     * @type {EventManager}
     */
    this.event = new EventManager(this)
  
    /**
     * @type {DatabaseManager}
     */
    this.database = new DatabaseManager(this)
  }
  
  /**
   * Loggin in the bot
   * @param {string} token Discord bot token
   */
  async start(token = process.env.TOKEN) {
    logger.info('Logging in bot...')

    this.command.load()
    this.event.load()
    this.database.load()
    await this.login(token)
  }

  /**
   * Setting status
   * @param {'dev'|'online'} status 
   */
  async setStatus(status = 'online', name = '점검중...') {
    if(status.includes('dev')) {
      logger.warn('Changed status to Developent mode')

      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION}@${this.BUILD_NUMBER} : ${name}` }
        ], 
        status: 'dnd'
      })
    } else if(status.includes('online')) {
      logger.info('Changed status to Online mode')
      
      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION}@${this.BUILD_NUMBER}` }
        ],
        status: 'online'
      })
    }
  }

}

module.exports = BotClient