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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hbmFnZXJzL0RhdGFiYXNlTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUE7QUFFMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRTdDOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLFdBQVc7SUFDOUMsTUFBTSxDQUFRO0lBRXRCLFlBQVksTUFBaUI7UUFDM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRWIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFFcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUVuQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YifQ==