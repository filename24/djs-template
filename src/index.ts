import Logger from './utils/Logger'
import path = require('path')

const logger = new Logger('main')
import config from "../config"

let BUILD_VERSION = '0.0.1-dev'
let BUILD_NUMBER = '2021-12-01'

console.log(require('chalk').cyanBright(`
=========================================================

             ${require('../package.json').name}
        Version : ${BUILD_VERSION}
        Build: ${BUILD_NUMBER}

=========================================================
`))

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack as string))
process.on('unhandledRejection', (e: Error) => logger.error(e.stack as string))

import BotClient from './structures/BotClient'
import CommandManager from './managers/CommandManager'
import EventManager from './managers/EventManager'
import DatabaseManager from './managers/DatabaseManager'

let client = new BotClient(config.bot.options, BUILD_VERSION)
let command = new CommandManager(client)
let event = new EventManager(client)
let database = new DatabaseManager(client)

command.load(path.join(__dirname, 'commands'))
event.load(path.join(__dirname, 'events'))
database.load()

client.start(config.bot.token)


