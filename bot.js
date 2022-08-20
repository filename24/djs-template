"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Logger_1 = __importDefault(require("./utils/Logger"));
const config_1 = __importDefault(require("./config"));
const BotClient_1 = __importDefault(require("./structures/BotClient"));
const logger = new Logger_1.default('main');
logger.log('Starting up...');
process.on('uncaughtException', (e) => logger.error(e.stack));
process.on('unhandledRejection', (e) => logger.error(e.stack));
const client = new BotClient_1.default(config_1.default.bot.options);
client.start(config_1.default.bot.token);
