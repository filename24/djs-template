require('module-alias/register')

const Logger = require('./structures/Logger')
const logger = new Logger('main')
const path = require('path')
/**
 * @type {import('../config')}
 */
const config = require('@config')

/* eslint-disable no-used-vars */
const BUILD_VERSION = '0.0.1-dev'
const BUILD_NUMBER = new Date().getFullYear() + '.' + new Date().getMonth() + '.' + new Date().getDate()
/* eslint-enable no-used-vars */

console.log(require('chalk').cyanBright(`
=========================================================

             ${require('../package.json').name}
        Version : ${BUILD_VERSION}
        Build: ${BUILD_NUMBER}

=========================================================
`))

logger.log('Starting up...')

const BotClient = require('./structures/BotClient')
const CommandManager = require('./managers/CommandManager')

const client = new BotClient(config.bot.options, BUILD_VERSION)
const commandManager = new CommandManager(client)

commandManager.loadCommands(path.join(__dirname, 'commands'))
commandManager.reloadCommands()
client.start(config.bot.token)


