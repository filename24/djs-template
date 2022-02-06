import { Client, ClientOptions, Collection } from 'discord.js'
import Dokdo from 'dokdo'
import Logger from '../utils/Logger'

import { BaseCommand, Event } from '../../typings/structures'
import config from '../../config'
import CommandManager from '../managers/CommandManager'
import EventManager from '../managers/EventManager'
import ErrorManager from '../managers/ErrorManager'
import DatabaseManager from '../managers/DatabaseManager'
import { Model } from 'mongoose'
import { config as dotenvConfig } from 'dotenv'

const logger = new Logger('bot')

export default class BotClient extends Client {
  public readonly VERSION: string
  public readonly BUILD_NUMBER: string | null
  public readonly config = config

  public commands: Collection<string, BaseCommand> = new Collection()
  public events: Collection<string, Event> = new Collection()
  public errors: Collection<string, string> = new Collection()
  public dokdo: Dokdo = new Dokdo(this, {
    prefix: this.config.bot.prefix,
    owners: config.bot.owners,
    noPerm: (message) => message.reply('당신은 Dokdo 를 이용할수 없습니다.')
  })
  public db: any
  public schemas: Collection<string, Model<any>> = new Collection()
  public command: CommandManager = new CommandManager(this)
  public event: EventManager = new EventManager(this)
  public error: ErrorManager = new ErrorManager(this)
  public database: DatabaseManager = new DatabaseManager(this)

  public constructor(options: ClientOptions) {
    super(options)
    dotenvConfig()

    logger.info('Loading config data...')

    this.VERSION = config.BUILD_VERSION
    this.BUILD_NUMBER = config.BUILD_NUMBER
  }

  public async start(token: string = config.bot.token): Promise<void> {
    logger.info('Logging in bot...')
    await this.login(token)
  }

  public async setStatus(
    status: 'dev' | 'online' = 'online',
    name = '점검중...'
  ) {
    if (status.includes('dev')) {
      logger.warn('Changed status to Developent mode')
      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION} : ${name}` }
        ],
        status: 'dnd'
      })
    } else if (status.includes('online')) {
      logger.info('Changed status to Online mode')

      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION}` }
        ],
        status: 'online'
      })
    }
  }
}
