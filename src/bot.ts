import 'dotenv/config'
import Logger from '@utils/Logger'
import config from './config'

import BotClient from '@structures/BotClient'

const logger = new Logger('main')

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack as string))
process.on('unhandledRejection', (e: Error) => logger.error(e.stack as string))

const client = new BotClient(config.bot.options)

client.start(config.bot.token)
