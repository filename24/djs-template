import { ClientEvents } from 'discord.js'
import { EventFunction, EventOptions } from '@types'
import BotClient from './BotClient.js'

/**
 * @example
 * export default new Event('ready', (client) => {
 *    console.log('ready')
 * })
 */
export class Event<E extends keyof ClientEvents> {
  constructor(
    public name: E,
    public execute: EventFunction<E>,
    public options?: EventOptions
  ) {}

  static isEvent(event: unknown): event is Event<keyof ClientEvents> {
    return event instanceof Event
  }

  static async waitUntil<E extends keyof ClientEvents>(
    client: BotClient,
    event: E,
    checkFunction: (...args: ClientEvents[E]) => boolean = () => true,
    timeout?: number
  ): Promise<ClientEvents[E] | []> {
    return await new Promise((resolve) => {
      let timeoutID: NodeJS.Timeout
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          client.off(event, eventFunction)
          resolve([])
        }, timeout)
      }
      const eventFunction = (...args: ClientEvents[E]): void => {
        if (checkFunction(...args)) {
          resolve(args)
          client.off(event, eventFunction)
          if (timeoutID !== undefined) clearTimeout(timeoutID)
        }
      }
      client.on(event, eventFunction)
    })
  }
}
