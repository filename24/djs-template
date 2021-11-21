
class BaseManager {
  /**
   * 
   * @param {import('../structures/BotClient')} client 
   */
  constructor(client) {
    this.client = client
  }

}

module.exports = BaseManager