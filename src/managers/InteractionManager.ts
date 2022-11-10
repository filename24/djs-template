import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import BotClient from '@structures/BotClient'
import { BaseInteraction } from '@structures/Interaction'
import Logger from '@utils/Logger'
import BaseManager from './BaseManager'

export default class InteractionManager extends BaseManager {
  private logger = new Logger('InteractionManager')
  public readonly interactions: BotClient['interactions']

  constructor(client: BotClient) {
    super(client)

    this.interactions = client.interactions
  }

  public async load(
    interactionPath: string = join(__dirname, '../interactions')
  ) {
    this.logger.debug('Loading interactions...')

    const interactionFolder = readdirSync(interactionPath)

    try {
      interactionFolder.forEach((folder) => {
        if (!lstatSync(join(interactionPath, folder)).isDirectory()) return

        try {
          const interactionFiles = readdirSync(join(interactionPath, folder))

          interactionFiles.forEach((interactionFile) => {
            try {
              const interaction: BaseInteraction =
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(`../interactions/${folder}/${interactionFile}`).default

              if (!interaction.customId)
                return this.logger.debug(
                  `interaction ${interactionFile} has no customId. Skipping.`
                )

              this.interactions.set(interaction.customId, interaction)

              this.logger.debug(`Loaded interaction ${interaction.customId}`)
            } catch (error: any) {
              this.logger.error(
                `Error loading interaction '${interactionFile}'.\n` +
                  error.stack
              )
            } finally {
              this.logger.debug(
                `Succesfully loaded interactions. count: ${this.interactions.size}`
              )
            }
            return this.interactions
          })
        } catch (error: any) {
          this.logger.error(
            `Error loading interaction folder '${folder}'.\n` + error.stack
          )
        }
      })
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  public get(customId: string): BaseInteraction | undefined {
    return this.interactions.find((_, id) => id.includes(customId))
  }
}
