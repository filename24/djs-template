import { Event } from '../structures/Event.js';
import Logger from '../utils/Logger.js';
const logger = new Logger('bot');
export default new Event('ready', async (client) => {
    logger.info(`Logged ${client.user?.username}`);
}, { once: true });
