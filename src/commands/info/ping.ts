import { BaseCommand } from "../../structures/Command"
import Discord from 'discord.js'
import Embed from '../../utils/Embed'
import { SlashCommandBuilder } from '@discordjs/builders'


export default new BaseCommand({
  name: 'ping',
  description: '핑을 측정합니다.',
  aliases: ['핑', '측정', 'vld'],
}, async (client, message, args) => {

  let embed = new Embed(client, 'warn').setTitle('핑 측정중...')

  let m = await message.reply({
    embeds: [embed],
  })
  embed = new Embed(client, 'success')
    .setTitle('PONG!')
    .addField('메세지 응답속도', `${Number(m.createdAt) - Number(message.createdAt)}ms`, true)
    .addField('API 반응속도', `${client.ws.ping}ms`, true)
    .addField('업타임', `<t:${Number(client.readyAt) / 1000 | 0}:R>`, true)

  m.edit({
    embeds: [embed],
  })
}, {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('핑을 측정합니다.'),
  options: {
    name: 'ping',
    isSlash: true
  },
  async execute(client, interaction) {
    let PingEmbed = new Embed(client, 'success')
      .setTitle('핑 측정')
      .addField('웹소켓 지연속도', `${client.ws.ping}ms`)
      .addField('업타임', `<t:${Number(client.readyAt) / 1000 | 0}:R>`)
    interaction.reply({ embeds: [PingEmbed] })
  }
})