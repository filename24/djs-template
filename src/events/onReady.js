const Logger = require('../utils/Logger')
let logger = new Logger('bot')

module.exports = {
  name: 'ready',
  once: true,
  /**
   * @param {import('../structures/BotClient')} client 
   */
  async execute(client) {
    logger.info(`Logged ${client.user.username}`)
  }
}