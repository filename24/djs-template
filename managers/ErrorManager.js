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
        this.logger = new Logger('Bot');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hbmFnZXJzL0Vycm9yTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVMsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBQ2pELE9BQU8sV0FBVyxNQUFNLGtCQUFrQixDQUFBO0FBQzFDLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQTtBQUNoQyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUl6QixPQUFPLE1BQU0sTUFBTSxjQUFjLENBQUE7QUFHakM7O0dBRUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLFlBQWEsU0FBUSxXQUFXO0lBQzNDLE1BQU0sQ0FBUTtJQUV0QixZQUFtQixNQUFpQjtRQUNsQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFYixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBWSxFQUFFLE9BQTRCO1FBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsQ0FBQTtRQUV4QyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzVDLE1BQU0sU0FBUyxHQUFHLFNBQVMsSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQzVELE1BQU0sU0FBUyxHQUFHLEVBQUUsRUFBRSxDQUFBO1FBRXRCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQWUsQ0FBQyxDQUFBO1FBRXhELE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFFBQVEsQ0FBQyxhQUFhLENBQUM7YUFDdkIsY0FBYyxDQUNiLG9EQUFvRCxDQUNyRDthQUNBLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFakUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNO1lBQ3ZCLENBQUMsQ0FBQyxhQUFhO2dCQUNiLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNuRCxDQUFDLENBQUMsSUFBSSxDQUFBO1FBRVIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksK0JBQXVCLEVBQUU7WUFDN0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUM7Z0JBQ2hDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2FBQy9CLENBQUMsQ0FBQTtZQUVGLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDeEI7YUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSw0QkFBb0IsRUFBRTtZQUNqRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQ2xCLENBQUE7WUFDVixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7WUFFdEUsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUU7Z0JBQ3pCLE9BQU8sSUFBSSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtZQUVyRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGIn0=