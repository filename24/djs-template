"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseManager_1 = __importDefault(require("./BaseManager"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
/**
 * @extends BaseManager
 */
class ErrorManager extends BaseManager_1.default {
    logger;
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('bot');
    }
    report(error, options) {
        this.logger.error(error.stack);
        const { isSend, executer } = options;
        const date = (Number(new Date()) / 1000) | 0;
        const errorText = `**[<t:${date}:T> ERROR]** ${error.stack}`;
        const errorCode = (0, uuid_1.v4)();
        this.client.errors.set(errorCode, error.stack);
        const errorEmbed = new Embed_1.default(this.client, 'error')
            .setTitle('오류가 발생했습니다.')
            .setDescription('명령어 실행 도중에 오류가 발생하였습니다. 개발자에게 오류코드를 보내 개발에 지원해주세요.')
            .addFields([{ name: '오류 코드', value: errorCode, inline: true }]);
        isSend ? executer?.reply({ embeds: [errorEmbed] }) : null;
        if (config_1.default.report.type == 'webhook') {
            const webhook = new discord_js_1.WebhookClient({
                url: config_1.default.report.webhook.url
            });
            webhook.send(errorText);
        }
        else if (config_1.default.report.type == 'text') {
            const guild = this.client.guilds.cache.get(config_1.default.report.text.guildID);
            const channel = guild.channels.cache.get(config_1.default.report.text.channelID);
            if (!channel?.isTextBased())
                return new TypeError('Channel is not text channel');
            channel?.send(errorText);
        }
    }
}
exports.default = ErrorManager;
