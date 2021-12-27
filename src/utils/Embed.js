const Discord = require('discord.js')

/**
 * @typedef {'success'|'error'|'warn'|'info'|'default'} EmbedType
 */

/**
 * @extends {Discord.MessageEmbed}
 */
class Embed extends Discord.MessageEmbed {
  /**
   * Custom embed constructor
   * @param {Discord.Client} client 
   * @param {EmbedType} type 
   */
  constructor(client, type) {
    let EmbedJSON = {
      timestamp: new Date(),
      footer : {
        text: client.user.username,
        icon_url: client.user.avatarURL()
      }
    }
  
    if(type === 'success') {
      EmbedJSON = {
        ...EmbedJSON,
        color: '57F287',
      }
    } else if(type === 'error') {
      EmbedJSON = {
        ...EmbedJSON,
        color: 'ED4245',
      }
    } else if(type === 'warn') {
      EmbedJSON = {
        ...EmbedJSON,
        color: 'FEE75C',
      }
    } else if(type === 'info') {
      EmbedJSON = {
        ...EmbedJSON,
        color: '5865F2',
      }
    } else if(type === 'default') {
      EmbedJSON = {
        ...EmbedJSON,
        color: '5865F2',
      }
    }
    

    super(EmbedJSON)
    this.client = client
    
  }

  /**
   * Change the embed color
   * @param {EmbedType} type 
   */
  setType(type) {
    if(type === 'success') {
      this.color = '57F287'
    } else if(type === 'error') {
      this.color = 'ED4245'
    } else if(type === 'warn') {
      this.color = 'FEE75C'
    } else if(type === 'info') {
      this.color = '5865F2'
    } else if(type === 'default') {
      this.color = '5865F2'
    }
  }
}

module.exports = Embed