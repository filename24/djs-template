import 'dotenv/config'
import Logger from '@utils/Logger'
import config from './config.js'

import BotClient from '@structures/BotClient'

const logger = new Logger('main')

logger.silly('Starting up...')

process.on('uncaughtException', (e) => logger.error(e))
process.on('unhandledRejection', (e: Error) => logger.error(e))

const client = new BotClient(config.bot.options)

client.start(config.bot.token)
