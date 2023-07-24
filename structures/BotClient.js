import { Client, Collection } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import * as Dokdo from 'dokdo';
import Logger from '../utils/Logger.js';
import config from '../config.js';
import CommandManager from '../managers/CommandManager.js';
import EventManager from '../managers/EventManager.js';
import ErrorManager from '../managers/ErrorManager.js';
import DatabaseManager from '../managers/DatabaseManager.js';
import InteractionManager from '../managers/InteractionManager.js';
const logger = new Logger('Bot');
export default class BotClient extends Client {
    VERSION;
    BUILD_NUMBER;
    config = config;
    commands = new Collection();
    events = new Collection();
    errors = new Collection();
    interactions = new Collection();
    db;
    command = new CommandManager(this);
    event = new EventManager(this);
    error = new ErrorManager(this);
    database = new DatabaseManager(this);
    interaction = new InteractionManager(this);
    eval = new Dokdo.Client(this, {
        prefix: this.config.bot.prefix,
        noPerm: async (message) => message.reply('You do not have permission to use this command.'),
        aliases: ['eval', 'dok']
    });
    constructor(options) {
        super(options);
        logger.info('Loading config data...');
        dotenvConfig();
        logger.info('Loading managers...');
        this.event.load();
        this.command.load();
        this.interaction.load();
        this.database.load();
        logger.info('Loading version data...');
        this.VERSION = config.BUILD_VERSION;
        this.BUILD_NUMBER = config.BUILD_NUMBER;
    }
    async start(token = config.bot.token) {
        logger.info('Logging in bot...');
        await this.login(token).then(() => {
            this.setStatus();
        });
    }
    setStatus(status = 'online', name = '점검중...') {
        if (status.includes('dev')) {
            logger.warn('Changed status to Developent mode');
            this.user?.setPresence({
                activities: [
                    { name: `${this.config.bot.prefix}help | ${this.VERSION} : ${name}` }
                ],
                status: 'dnd'
            });
        }
        else if (status.includes('online')) {
            logger.info('Changed status to Online mode');
            this.user?.setPresence({
                activities: [
                    { name: `${this.config.bot.prefix}help | ${this.VERSION}` }
                ],
                status: 'online'
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90Q2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvQm90Q2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxNQUFNLEVBQStCLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUM1RSxPQUFPLEVBQUUsTUFBTSxJQUFJLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUMvQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQTtBQUU5QixPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFNbEMsT0FBTyxNQUFNLE1BQU0sY0FBYyxDQUFBO0FBRWpDLE9BQU8sY0FBYyxNQUFNLDBCQUEwQixDQUFBO0FBQ3JELE9BQU8sWUFBWSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sWUFBWSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFBO0FBQ3ZELE9BQU8sa0JBQWtCLE1BQU0sOEJBQThCLENBQUE7QUFFN0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFFaEMsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsTUFBTTtJQUMzQixPQUFPLENBQVE7SUFDZixZQUFZLENBQVE7SUFDcEIsTUFBTSxHQUFHLE1BQU0sQ0FBQTtJQUV4QixRQUFRLEdBQW9DLElBQUksVUFBVSxFQUFFLENBQUE7SUFDNUQsTUFBTSxHQUNYLElBQUksVUFBVSxFQUFFLENBQUE7SUFDWCxNQUFNLEdBQStCLElBQUksVUFBVSxFQUFFLENBQUE7SUFDckQsWUFBWSxHQUNqQixJQUFJLFVBQVUsRUFBRSxDQUFBO0lBQ1gsRUFBRSxDQUFlO0lBRWpCLE9BQU8sR0FBbUIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEQsS0FBSyxHQUFpQixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QyxL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