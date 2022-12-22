"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const promises_1 = require("timers/promises");
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const chalk_1 = __importDefault(require("chalk"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const logger = new Logger_1.default('ShardManager');
const main = async () => {
    console.log(chalk_1.default.cyanBright(`
                    =========================================================
  
  
                                ${config_1.default.name}@${config_1.default.BUILD_NUMBER}
                              Version : ${config_1.default.BUILD_VERSION}
  
  
                    =========================================================`));
    if (!config_1.default.bot.sharding) {
        require('./bot');
    }
    else {
        try {
            if (!(0, fs_1.readFileSync)((0, path_1.join)(__dirname, './bot.ts')))
                return;
            for (let index = 0; index < 6; index++) {
                console.log(' ');
            }
            logger.warn('Sharding system not supported typescript file');
            for (let index = 0; index < 6; index++) {
                console.log(' ');
            }
            await (0, promises_1.setTimeout)(1500);
            require('./bot');
        }
        catch (e) {
            const manager = new discord_js_1.ShardingManager('./build/bot.js', config_1.default.bot.shardingOptions);
            manager.spawn();
            manager.on('shardCreate', async (shard) => {
                logger.info(`Shard #${shard.id} created.`);
            });
        }
    }
};
main();
