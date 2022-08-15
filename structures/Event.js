"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    name;
    execute;
    options;
    constructor(name, execute, options) {
        this.name = name;
        this.execute = execute;
        this.options = options;
    }
    static isEvent(event) {
        return event instanceof Event;
    }
    static async waitUntil(client, event, checkFunction = () => true, timeout) {
        return await new Promise((resolve) => {
            let timeoutID;
            if (timeout !== undefined) {
                timeoutID = setTimeout(() => {
                    client.off(event, eventFunction);
                    resolve([]);
                }, timeout);
            }
            const eventFunction = (...args) => {
                if (checkFunction(...args)) {
                    resolve(args);
                    client.off(event, eventFunction);
                    if (timeoutID !== undefined)
                        clearTimeout(timeoutID);
                }
            };
            client.on(event, eventFunction);
        });
    }
}
exports.Event = Event;
