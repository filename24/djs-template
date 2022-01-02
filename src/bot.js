const Logger = require('./utils/Logger')
const logger = new Logger('main')
const BotClient = require('./structures/BotClient')

let config = require('../config')

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack))
process.on('unhandledRejection', (e) => logger.error(e.stack))


let client = new BotClient(config.bot.options)


client.start(config.bot?.token)
