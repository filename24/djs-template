import { dirname, resolve } from 'path'
import BotClient from '@structures/BotClient'
import { BaseInteraction } from '@structures/Interaction'
import Logger from '@utils/Logger'
import BaseManager from './BaseManager.js'
import { Interaction } from 'discord.js'
import ErrorManager from './ErrorManager.js'
import { InteractionType } from '@utils/Constants'
import { InteractionType as DInteractionType } from 'discord.js'
import { fileURLToPath, pathToFileURL } from 'url'
import { readAllFiles } from '@utils/Utils.js'
export default class InteractionManager extends BaseManager {
  private logger = new Logger('InteractionManager')
  public readonly interactions: BotClient['interactions']

  constructor(client: BotClient) {
    super(client)

    this.interactions = client.interactions
  }

  public async load(
    interactionPath: string = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../interactions'
    )
  ) {
    this.logger.debug('Loading interactions...')

    const interactionFiles = readAllFiles(interactionPath)

    await Promise.all(
      interactionFiles.map(async (interactionFile) => {
        try {
          const { default: interaction } = await import(
            pathToFileURL(interactionFile).toString()
          )

          if (!interaction.customId)
            return this.logger.debug(
              `interaction ${interactionFile} has no customId. Skipping.`
            )

          this.interactions.set(interaction.customId, interaction)

          this.logger.debug(`Loaded interaction ${interaction.customId}`)
        } catch (error: any) {
          this.logger.error(
            `Error loading interaction '${interactionFile}'.\n` + error.stack
          )
        }
      })
    )

    this.logger.info(
      `Succesfully loaded interactions. count: ${this.interactions.size}`
    )
    return this.interactions
  }

  public get(customId: string): BaseInteraction | undefined {
    return this.interactions.find((_, id) => {
      if (typeof id === 'string' && id === customId) return true

      id.includes(customId)
    })
  }

  public async cacheEvent(interaction: Interaction) {
    const errorManager = new ErrorManager(this.client)

    if (!interaction.inCachedGuild()) return

    if (interaction.isButton()) {
      const interactionData = this.get(interaction.customId)

      if (!interactionData) return
      if (interactionData.type !== InteractionType.Button) return

      try {
        interactionData.execute(this.client, interaction)
      } catch (error: any) {
        errorManager.report(error, { executer: interaction, isSend: true })
      }
    } else if (interaction.isAnySelectMenu()) {
      const interactionData = this.get(interaction.customId)

      if (!interactionData) return
      if (interactionData.type !== InteractionType.Select) return

      try {
        interactionData.execute(this.client, interaction)
      } catch (error: any) {
        errorManager.report(error, { executer: interaction, isSend: true })
      }
    } else if (
      interaction.isContextMenuCommand() ||
      interaction.isUserContextMenuCommand() ||
      interaction.isMessageContextMenuCommand()
    ) {
      const interactionData = this.get(interaction.commandName)

      if (!interactionData) return
      if (interactionData.type !== InteractionType.ContextMenu) return

      try {
        interactionData.execute(this.client, interaction)
      } catch (error: any) {
        errorManager.report(error, { executer: interaction, isSend: true })
      }
    } else if (interaction.type === DInteractionType.ModalSubmit) {
      const interactionData = this.get(interaction.customId)

      if (!interactionData) return
      if (interactionData.type !== InteractionType.Modal) return

      try {
        interactionData.execute(this.client, interaction)
      } catch (error: any) {
        errorManager.report(error, { executer: interaction, isSend: true })
      }
    } else if (
      interaction.type === DInteractionType.ApplicationCommandAutocomplete
    ) {
      const interactionData = this.get(interaction.commandName)

      if (!interactionData) return
      if (interactionData.type !== InteractionType.AutoComplete) return

      try {
        interactionData.execute(this.client, interaction)
      } catch (error: any) {
        errorManager.report(error)
      }
    }
  }
}
