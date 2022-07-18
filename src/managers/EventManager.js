"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Event_1 = require("../structures/Event");
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
/**
 * @extends {BaseManager}
 */
class EventManager extends BaseManager_1.default {
    logger;
    events;
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('EventManager');
        this.events = client.events;
    }
    async load(eventPath = (0, path_1.join)(__dirname, '../events')) {
        this.logger.debug('Loading events...');
        const eventFiles = (0, fs_1.readdirSync)(eventPath);
        eventFiles.forEach(async (eventFile) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const event = require(`../events/${eventFile}`).default;
                if (!event.name)
                    return this.logger.debug(`Event ${eventFile} has no name. Skipping.`);
                this.events.set(event.name, event);
                this.logger.debug(`Loaded event ${eventFile}`);
            }
            catch (error) {
                this.logger.error(`Error loading events '${eventFile}'.\n` + error.stack);
            }
        });
        this.logger.debug(`Succesfully loaded events. count: ${this.events.size}`);
        this.start();
    }
    async start() {
        this.logger.debug('Starting event files...');
        this.events.forEach((event, eventName) => {
            if (!Event_1.Event.isEvent(event))
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
    reload(eventPath = (0, path_1.join)(__dirname, '../events')) {
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
exports.default = EventManager;
