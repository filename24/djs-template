"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../config"));
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("../package.json");
const Logger_1 = __importDefault(require("./utils/Logger"));
const logger = new Logger_1.default('shard');
console.log(chalk_1.default.cyanBright(`
                  =========================================================


                              ${package_json_1.name}@${config_1.default.BUILD_NUMBER}
                            Version : ${config_1.default.BUILD_VERSION}


                  =========================================================`));
if (!config_1.default.bot.sharding) {
    require('./bot.ts');
}
else {
    const manager = new discord_js_1.ShardingManager('./src/bot.ts', config_1.default.bot.shardingOptions);
    manager.spawn();
    manager.on('shardCreate', async (shard) => {
        logger.info(`Shard #${shard.id} created.`);
    });
}
