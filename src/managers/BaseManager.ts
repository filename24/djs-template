
export default class BaseManager {
  public client: typeof import('../structures/BotClient')

  constructor(client: typeof import('../structures/BotClient')) {
    this.client = client
  }
}