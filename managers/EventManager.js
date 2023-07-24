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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hbmFnZXJzL0V2ZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sSUFBSSxDQUFBO0FBQ2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBQ3BDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUN6QyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUE7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUVuQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFDM0MsTUFBTSxDQUFRO0lBQ2QsTUFBTSxDQUFxQjtJQUVuQyxZQUFZLE1BQWlCO1FBQzNCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUViLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBO0lBQzdCLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUNmLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDO1FBRXRFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFFdEMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtZ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