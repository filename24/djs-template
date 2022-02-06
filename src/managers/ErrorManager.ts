import Discord, { Guild } from 'discord.js'
import BaseManager from './BaseManager'
import Embed from '../utils/Embed'
import Logger from '../utils/Logger'
import uuid from 'uuid'
import { ErrorReportOptions } from '../../typings'
import BotClient from '../structures/BotClient'

import config from '../../config'

/**
 * @extends BaseManager
 */
export default class ErrorManager extends BaseManager {
  private logger: Logger

  public constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('bot')
  }
 

  public report(error: Error, options: ErrorReportOptions) {
    this.logger.error(error.stack as string)

    const { isSend, executer } = options
    const date = (Number(new Date()) / 1000) | 0
    const errorText = `**[<t:${date}:T> ERROR]** ${error.stack}`
    const errorCode = uuid.v4()

    this.client.errors.set(errorCode, error.stack as string)

    const errorEmbed = new Embed(this.client, 'error')
      .setTitle('오류가 발생했습니다.')
      .setDescription(
        '명령어 실행 도중에 오류가 발생하였습니다. 개발자에게 오류코드를 보내 개발에 지원해주세요.'
      )
      .addField('오류 코드', errorCode, true)

    isSend ? executer?.reply({ embeds: [errorEmbed] }) : null

    if (config.report.type == 'webhook') {
      const webhook = new Discord.WebhookClient({
        url: config.report.webhook.url
      })

      webhook.send(errorText)
    } else if (config.report.type == 'text') {
      const guild = this.client.guilds.cache.get(
        config.report.text.guildID
      ) as Guild
      const channel = guild.channels.cache.get(config.report.text.channelID)

      if (!channel?.isText())
        return new TypeError('Channel is not text channel')

      channel?.send(errorText)
    }
  }
}
