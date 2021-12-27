require('module-alias')()

const Logger = require('./utils/Logger')
const logger = new Logger('main')
const path = require('path')
const fs = require('fs')

let config = require('../config')

let BUILD_VERSION = '0.0.1-dev'
let BUILD_NUMBER = fs.readFileSync('.git/HEAD').toString().trim()

if (BUILD_NUMBER?.indexOf(':') === -1) {
  BUILD_NUMBER
} else {
  try {
    BUILD_NUMBER = fs.readFileSync('.git/' + BUILD_NUMBER?.substring(5)).toString().trim().substring(0, 6)
  } catch (e) {
    BUILD_NUMBER = undefined
  }
}

console.log(require('chalk').cyanBright(`
=========================================================

            ${require('../package.json').name}@${BUILD_NUMBER}
          Version : ${BUILD_VERSION}

=========================================================
`))

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack))
process.on('unhandledRejection', (e) => logger.error(e.stack))

const BotClient = require('./structures/BotClient')
const CommandManager = require('./managers/CommandManager')
const EventManager = require('./managers/EventManager')
const DatabaseManager = require('./managers/DatabaseManager')

let client = new BotClient(config.bot.options, {
  VERSION: BUILD_VERSION,
  NUMBER: BUILD_NUMBER,
})
let command = new CommandManager(client)
let event = new EventManager(client)
let database = new DatabaseManager(client)

command.load(path.join(__dirname, 'commands'))
event.load(path.join(__dirname, 'events'))
database.load()

client.start(config.bot.token)


