const Discord = require('discord.js')
const Embed = require('../../utils/Embed')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'ping',
  description : '핑을 측정합니다.',
  aliases: ['핑', '측정', 'vld'],
  /**
   * @param {import('../../structures/BotClient')} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   */
  async execute(client, message, args) {

    let embed = new Embed(client, 'warn').setTitle('핑 측정중...')

    let m = await message.reply({
      embeds: [embed],
    })
    embed = new Embed(client, 'success')
      .setTitle('PONG!')
      .addField('메세지 응답속도', `${m.createdAt - message.createdAt}ms`, true)
      .addField('API 반응속도', `${client.ws.ping}ms`, true)
      .addField('업타임', `<t:${Number(client.readyAt) / 1000 | 0}:R>`, true)

    m.edit({
      embeds: [embed],
    })
  },
  slash: {
    name: 'ping',
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('핑을 측정합니다.')
      .toJSON(),
    /**
     * 
     * @param {import('../../structures/BotClient')} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
      let PingEmbed = new Embed(client, 'success')
        .setTitle('핑 측정')
        .addField('웹소켓 지연속도', `${client.ws.ping}ms`)
        .addField('업타임', `<t:${Number(client.readyAt) / 1000 | 0}:R>`)
      interaction.reply({ embeds: [PingEmbed]})
    }
  }
}