import { Event } from '@structures/Event'
import Logger from '@utils/Logger'
const logger = new Logger('Bot')

export default new Event(
  'ready',
  async (client) => {
    logger.info(`Logged ${client.user?.username}`)
  },
  { once: true }
)
