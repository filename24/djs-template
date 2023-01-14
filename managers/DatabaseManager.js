import Logger from '../utils/Logger.js';
import BaseManager from './BaseManager.js';
import { PrismaClient } from '@prisma/client';
/**
 * @extends {BaseManager}
 */
export default class DatabaseManager extends BaseManager {
    logger;
    constructor(client) {
        super(client);
        this.logger = new Logger('DatabaseManager');
    }
    async load() {
        this.logger.debug('Using Prisma...');
        this.client.db = new PrismaClient();
        this.client.db.$connect().then(() => {
            this.logger.info('Connected to Prisma');
        });
    }
}
