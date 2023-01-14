import { WebhookClient } from 'discord.js';
import BaseManager from './BaseManager.js';
import Embed from '../utils/Embed.js';
import Logger from '../utils/Logger.js';
import { v4 } from 'uuid';
import config from '../config.js';
/**
 * @extends BaseManager
 */
export default class ErrorManager extends BaseManager {
    logger;
    constructor(client) {
        super(client);
        this.logger = new Logger('bot');
    }
    report(error, options) {
        this.logger.error(error.stack);
        const date = (Number(new Date()) / 1000) | 0;
        const errorText = `**[<t:${date}:T> ERROR]** ${error.stack}`;
        const errorCode = v4();
        this.client.errors.set(errorCode, error.stack);
        const errorEmbed = new Embed(this.client, 'error')
            .setTitle('오류가 발생했습니다.')
            .setDescription('명령어 실행 도중에 오류가 발생하였습니다. 개발자에게 오류코드를 보내 개발에 지원해주세요.')
            .addFields([{ name: '오류 코드', value: errorCode, inline: true }]);
        options && options.isSend
            ? // @ts-ignore
                options.executer?.reply({ embeds: [errorEmbed] })
            : null;
        if (config.report.type === 0 /* ReportType.Webhook */) {
            const webhook = new WebhookClient({
                url: config.report.webhook.url
            });
            webhook.send(errorText);
        }
        else if (config.report.type === 1 /* ReportType.Text */) {
            const guild = this.client.guilds.cache.get(config.report.text.guildID);
            const channel = guild.channels.cache.get(config.report.text.channelID);
            if (!channel?.isTextBased())
                return new TypeError('Channel is not text channel');
            channel.send(errorText);
        }
    }
}
