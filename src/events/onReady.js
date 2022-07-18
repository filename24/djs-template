"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../structures/Event");
const Logger_1 = __importDefault(require("../utils/Logger"));
const logger = new Logger_1.default('bot');
exports.default = new Event_1.Event('ready', async (client) => {
    logger.info(`Logged ${client.user?.username}`);
}, { once: true });
