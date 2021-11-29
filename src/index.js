require('module-alias')()

const Logger = require('./utils/Logger')
const logger = new Logger('main')
const path = require('path')

let config = require('../config')

let BUILD_VERSION = '0.0.1-dev'
let BUILD_NUMBER = new Date().getFullYear() + '.' + new Date().getMonth() + '.' + new Date().getDate()

console.log(require('chalk').cyanBright(`
=========================================================

             ${require('../package.json').name}
        Version : ${BUILD_VERSION}
        Build: ${BUILD_NUMBER}

=========================================================
`))

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack))
process.on('unhandledRejection', (e) => logger.error(e.stack))

const BotClient = require('./structures/BotClient')
const CommandManager = require('./managers/CommandManager')
const EventManager = require('./managers/EventManager')

let client = new BotClient(config.bot.options, BUILD_VERSION)
let commandManager = new CommandManager(client)
let eventManager = new EventManager(client)

commandManager.load(path.join(__dirname, 'commands'))
eventManager.load(path.join(__dirname, 'events'))

client.start(config.bot.token)


