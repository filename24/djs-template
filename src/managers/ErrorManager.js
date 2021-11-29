const Discord = require('discord.js')
const BaseManager = require('./BaseManager')
const Embed = require('../utils/Embed')
const Logger = require('../utils/Logger')
const uuid = require('uuid')

let config = require('../../config')

/**
 * @extends BaseManager
 */
class ErrorManager extends BaseManager {
  /**
   * ErrorManager constructor
   * @param {import('../structures/BotClient')} client Bot client
   */
  constructor(client) {
    super(client)

    this.logger = new Logger('bot')
  }

  /**
   * Report error in Discord Channel
   * @param {Error} error Error object
   * @param {Discord.Message|Discord.CommandInteraction} executer
   * @param {boolean} [userSend=false] If the error is send to the user
   */
  report(error, executer, userSend = true) {
    this.logger.error(error.stack)
    

    let date = Number(new Date()) / 1000 | 0
    let errorText = `**[<t:${date}:T> ERROR]** ${error.stack}`
    let errorCode = uuid.v4()

    this.client.errors.set(errorCode, error.stack)

    let errorEmbed = new Embed(this.client, 'error')
      .setTitle('오류가 발생했습니다.')
      .setDescription('명령어 실행 도중에 오류가 발생하였습니다. 개발자에게 오류코드를 보내 개발에 지원해주세요.')
      .addField('오류 코드', errorCode, true)

    userSend ? executer?.reply({ embeds: [errorEmbed]}) : null
    if(config.report.type == 'webhook') {
      let webhook = new Discord.WebhookClient({
        url: config.report.webhook.url,
      })

      webhook.send(errorText)
    } else if(config.report.type == 'text') {
      let guild = this.client.guilds.cache.get(config.report.text.guildID)
      let channel = guild.channels.cache.get(config.report.text.channelID)
      
      channel.send(errorText)
    }
    
  }
}

module.exports = ErrorManager