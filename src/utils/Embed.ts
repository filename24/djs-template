import { Client, MessageEmbedOptions, MessageEmbed } from 'discord.js'
import { EmbedType } from '../../typings'

export default class Embed extends MessageEmbed {
  constructor(client: Client, type: EmbedType) {
    if (!client.isReady()) return

    const EmbedJSON: MessageEmbedOptions = {
      timestamp: new Date(),
      footer: {
        text: client.user.username,
        icon_url: client.user.avatarURL() ?? undefined
      }
    }
    if (type === 'success') EmbedJSON.color = '#57F287'
    else if (type === 'error') EmbedJSON.color = '#ED4245'
    else if (type === 'warn') EmbedJSON.color = '#FEE75C'
    else if (type === 'info') EmbedJSON.color = '#5865F2'
    else if (type === 'default') EmbedJSON.color = '#5865F2'

    super(EmbedJSON)
  }

  setType(type: EmbedType) {
    if (type === 'success') this.setColor('#57F287')
    else if (type === 'error') this.setColor('#ED4245')
    else if (type === 'warn') this.setColor('#FEE75C')
    else if (type === 'info') this.setColor('#5865F2')
    else if (type === 'default') this.setColor('#5865F2')
  }
}
