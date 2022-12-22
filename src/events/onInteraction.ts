import CommandManager from '@managers/CommandManager'
import ErrorManager from '@managers/ErrorManager'
import InteractionManager from '@managers/InteractionManager'
import { Event } from '@structures/Event'

export default new Event('interactionCreate', async (client, interaction) => {
  const interactionManager = new InteractionManager(client)
  const commandManager = new CommandManager(client)
  const errorManager = new ErrorManager(client)

  if (!interaction.inCachedGuild()) return

  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return

    const command = commandManager.get(interaction.commandName)
    try {
      if (CommandManager.isSlash(command)) {
        command.slash
          ? await command.slash.execute(client, interaction)
          : await command.execute(client, interaction)
      }
      //await interaction.deferReply().catch(() => { })
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  }

  interactionManager.cacheEvent(interaction)
})
