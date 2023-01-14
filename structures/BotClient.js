import { Client, Collection } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import Dokdo from 'dokdo';
import Logger from '../utils/Logger.js';
import config from '../config.js';
import CommandManager from '../managers/CommandManager.js';
import EventManager from '../managers/EventManager.js';
import ErrorManager from '../managers/ErrorManager.js';
import DatabaseManager from '../managers/DatabaseManager.js';
import InteractionManager from '../managers/InteractionManager.js';
const logger = new Logger('bot');
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
    dokdo = new Dokdo(this, {
        prefix: this.config.bot.prefix,
        noPerm: async (message) => message.reply('You do not have permission to use this command.')
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
        await this.login(token).then(() => this.setStatus());
    }
    async setStatus(status = 'online', name = '점검중...') {
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
