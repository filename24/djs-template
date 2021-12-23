const Discord = require('discord.js')
const Embed = require('../../utils/Embed')
const { SlashCommandBuilder } = require('@discordjs/builders')
const wait = require('node:util').promisify(setTimeout)

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
    let buttonData = new Discord.MessageButton()
      .setStyle('PRIMARY')
      .setLabel('재측정하기')
      .setCustomId('ping.retry')

    let components = new Discord.MessageActionRow()
      .addComponents(buttonData)
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
      components: [components]
    })

    let collector = m.channel.createMessageComponentCollector({time: 5 * 1000})

    collector.on('collect', async (interaction) => {
      if(interaction.customId === 'ping.retry') {
        collector.stop()
        await interaction.deferUpdate()
        this.execute(client, m, args)
        await wait(1000)
        await m.delete()
      } else if (interaction.user.id !== message.author.id) {
        interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 재측정할 수 있습니다.`)
      }
    })

    collector.on('end', async (collect) => {
      if(collect.size !== 0) return;
      buttonData
        .setDisabled()
        .setStyle('SECONDARY')
        .setLabel('시간 초과')
        
      components = new Discord.MessageActionRow()
        .addComponents(buttonData)
      m.edit({
        embeds: [embed],
        components: [components]
      })
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