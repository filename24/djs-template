import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { Event } from '../structures/Event.js';
import Logger from '../utils/Logger.js';
import BaseManager from './BaseManager.js';
import { fileURLToPath } from 'url';
/**
 * @extends {BaseManager}
 */
export default class EventManager extends BaseManager {
    logger;
    events;
    constructor(client) {
        super(client);
        this.logger = new Logger('EventManager');
        this.events = client.events;
    }
    async load(eventPath = join(dirname(fileURLToPath(import.meta.url)), '../events')) {
        this.logger.debug('Loading events...');
        const eventFiles = readdirSync(eventPath);
        await Promise.all(eventFiles.map(async (eventFile) => {
            try {
                const { default: event } = await import(`../events/${eventFile}`);
                if (!event.name)
                    return this.logger.debug(`Event ${eventFile} has no name. Skipping.`);
                this.events.set(event.name, event);
                this.logger.debug(`Loaded event ${eventFile}`);
            }
            catch (error) {
                this.logger.error(`Error loading events '${eventFile}'.\n` + error.stack);
            }
        }));
        this.logger.info(`Succesfully loaded events. count: ${this.events.size}`);
        this.start();
    }
    async start() {
        this.logger.debug('Starting event files...');
        this.events.forEach((event, eventName) => {
            if (!Event.isEvent(event))
                return;
            if (event.options?.once) {
                this.client.once(eventName, (...args) => {
                    event.execute(this.client, ...args);
                });
                this.logger.debug(`Started event '${eventName}' once.`);
            }
            else {
                this.client.on(eventName, (...args) => {
                    event.execute(this.client, ...args);
                });
                this.logger.debug(`Started event '${eventName}' on.`);
            }
        });
    }
    reload(eventPath = join(__dirname, '../events')) {
        this.logger.debug('Reloading events...');
        this.events.clear();
        this.load(eventPath);
    }
    /**
     * @example EventManager.register('ready', (client) => {
     *  console.log(`${client.user.tag} is ready!`)
     * })
     */
    register(eventName, fn) {
        const eventFuntion = {
            name: eventName,
            execute: fn,
            options: {
                once: true
            }
        };
        this.events.set(eventName, eventFuntion);
        // @ts-ignore
        this.client.on(eventName, fn);
        this.logger.debug(`Registered event '${eventName}'`);
    }
}
