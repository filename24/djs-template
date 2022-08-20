import Logger from '@utils/Logger'
import BaseManager from './BaseManager'
import BotClient from '@structures/BotClient'
import { PrismaClient } from '@prisma/client'

/**
 * @extends {BaseManager}
 */
export default class DatabaseManager extends BaseManager {
  private logger: Logger

  constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('DatabaseManager')
  }

  async load() {
    this.logger.debug('Using Prisma...')

    this.client.db = new PrismaClient()

    this.client.db.$connect().then(() => {
      this.logger.info('Connected to Prisma')
    })
  }
}
