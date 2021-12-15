import { Client, ClientOptions, Collection } from 'discord.js'
import Dokdo from 'dokdo'
import Logger from '../utils/Logger'

import { Command, Config, Event, SlashCommand } from '../../typings'

const config = require('../../config.js')
const logger = new Logger('bot')

export default class BotClient extends Client {

  readonly VERSION: string
  public config: Config = require('../../config')
  public commands: Collection<string, Command> = new Collection()
  public events: Collection<string, Event> = new Collection()
  public errors: Collection<string, string> = new Collection()
  public dokdo: Dokdo = new Dokdo(this, {
    prefix: this.config.bot.prefix,
    owners: config.bot.owners,
    noPerm: (message) => message.reply('당신은 Dokdo 를 이용할수 없습니다.')
  })
  public db: typeof import('mongoose')| typeof import('quick.db')
  public schemas: Collection<string, import('mongoose').Schema> = new Collection()

  public constructor(options: ClientOptions, BUILD_VERSION: string) {
    super(options)

    logger.info('Loading config data...')

    this.VERSION = BUILD_VERSION
  }

  public async start(token: string = config.bot.token): Promise<void> {
    logger.info('Logging in bot...')
    await this.login(token)
  }

  public async setStatus(status: 'dev'|'online' = 'online', name: string = '점검중...') {
    if(status.includes('dev')) {
      logger.warn('Changed status to Developent mode')
      this.user?.setPresence({
        activities: [
          { name: `${this.config.bot.prefix}help | ${this.VERSION} : ${name}` }
        ], 
        status: 'dnd'
      })
    } else if(status.includes('online')) {
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
