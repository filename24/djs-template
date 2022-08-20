import BotClient from '@structures/BotClient'

export default class BaseManager {
  public client: BotClient

  constructor(client: BotClient) {
    this.client = client
  }
}
