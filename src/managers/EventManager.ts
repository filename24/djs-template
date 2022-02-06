import { Awaitable, ClientEvents } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import BotClient from '../structures/BotClient'
import { Event } from '../structures/Event'
import Logger from '../utils/Logger'
import BaseManager from './BaseManager'

/**
 * @extends {BaseManager}
 */
export default class EventManager extends BaseManager {
  private logger: Logger
  private events: BotClient['events']

  constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('EventManager')

    this.events = client.events
  }

  public async load(eventPath = join(__dirname, '../events')) {
    this.logger.debug('Loading events...')

    const eventFiles = readdirSync(eventPath)

    eventFiles.forEach(async (eventFile) => {
      try {
        if (!eventFile.endsWith('.ts'))
          return this.logger.debug(
            `Not a TypeScript file ${eventFile}. Skipping.`
          )

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { default: event } = require(`../events/${eventFile}`)

        if (!event.name)
          return this.logger.debug(`Event ${eventFile} has no name. Skipping.`)

        this.events.set(event.name, event)
        this.logger.debug(`Loaded event ${eventFile}`)
      } catch (error: any) {
        this.logger.error(
          `Error loading events '${eventFile}'.\n` + error.stack
        )
      }
    })
    this.logger.debug(`Succesfully loaded events. count: ${this.events.size}`)

    this.start()
  }

  private async start() {
    this.logger.debug('Starting event files...')

    this.events.forEach((event, eventName) => {
      if (!Event.isEvent(event)) return

      if (event.options?.once) {
        this.client.once(eventName, (...args) => {
          // @ts-ignore
          event.execute(this.client, ...args)
        })

        this.logger.debug(`Started event '${eventName}' once.`)
      } else {
        this.client.on(eventName, (...args) => {
          // @ts-ignore
          event.execute(this.client, ...args)
        })

        this.logger.debug(`Started event '${eventName}' on.`)
      }
    })
  }

  public reload(eventPath = join(__dirname, '../events')) {
    this.logger.debug('Reloading events...')

    this.events.clear()

    this.load(eventPath)
  }

  /**
   * @example EventManager.register('ready', (client) => {
   *  console.log(`${client.user.tag} is ready!`)
   * })
   */
  public register(
    eventName: keyof ClientEvents,
    fn: (
      client: BotClient,
      ...args: ClientEvents[keyof ClientEvents]
    ) => Awaitable<void>
  ) {
    const eventFuntion = {
      name: eventName,
      execute: fn,
      options: {
        once: true
      }
    }
    this.events.set(eventName, eventFuntion)

    // @ts-ignore
    this.client.on(eventName, fn)

    this.logger.debug(`Registered event '${eventName}'`)
  }
}
