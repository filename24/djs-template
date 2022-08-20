import { PrismaClient } from '@prisma/client'
import { Client, ClientOptions, ClientEvents, Collection } from 'discord.js'
import { config as dotenvConfig } from 'dotenv'
import Dokdo from 'dokdo'

import Logger from '@utils/Logger'

import { BaseCommand } from '@types'
import { BaseInteraction } from './Interaction'
import { Event } from './Event'

import config from '../config'

import CommandManager from '@managers/CommandManager'
import EventManager from '@managers/EventManager'
import ErrorManager from '@managers/ErrorManager'
import DatabaseManager from '@managers/DatabaseManager'
import InteractionManager from '@managers/InteractionManager'

const logger = new Logger('bot')

export default class BotClient extends Client {
  public readonly VERSION: string
  public readonly BUILD_NUMBER: string
  public readonly config = config

  public commands: Collection<string, BaseCommand> = new Collection()
  public events: Collection<keyof ClientEvents, Event<keyof ClientEvents>> =
    new Collection()
  public errors: Collection<string, string> = new Collection()
  public interactions: Collection<string, BaseInteraction> = new Collection()
  public db!: PrismaClient

  public command: CommandManager = new CommandManager(this)
  public event: EventManager = new EventManager(this)
  public error: ErrorManager = new ErrorManager(this)
  public database: DatabaseManager = new DatabaseManager(this)
  public interaction: InteractionManager = new InteractionManager(this)
  public dokdo: Dokdo = new Dokdo(this, {
    prefix: this.config.bot.prefix,
    noPerm: async (message) =>
      message.reply('You do not have permission to use this command.')
  })

  public constructor(options: ClientOptions) {
    super(options)

    logger.info('Loading config data...')
    dotenvConfig()

    logger.info('Loading managers...')
    this.command.load()
    this.event.load()
    this.interaction.load()
    this.database.load()

    logger.info('Loading version data...')
    this.VERSION = config.BUILD_VERSION
    this.BUILD_NUMBER = config.BUILD_NUMBER
  }

  public async start(token: string = config.bot.token): Promise<void> {
    logger.info('Logging in bot...')
    await this.login(token).then(() => this.setStatus())
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
