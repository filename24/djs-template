import { ChannelType } from 'discord.js'
import CommandManager from '../managers/CommandManager'
import ErrorManager from '../managers/ErrorManager'
import { Event } from '../structures/Event'

export default new Event('interactionCreate', async (client, interaction) => {
  const commandManager = new CommandManager(client)
  const errorManager = new ErrorManager(client)

  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return
    if (interaction.channel?.type === ChannelType.DM)
      return interaction.reply('DM으로는 명령어 사용이 불가능해요')

    const command = commandManager.get(interaction.commandName)
    try {
      if (commandManager.isSlash(command)) {
        command.slash
          ? await command.slash.execute(client, interaction)
          : await command.execute(client, interaction)
      }
      //await interaction.deferReply().catch(() => { })
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  }
})
