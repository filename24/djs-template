import {
  ApplicationCommandDataResolvable,
  Collection,
  REST,
  Routes
} from 'discord.js'
import { BaseCommand as Command, InteractionData } from '@types'

import Logger from '@utils/Logger'
import BaseManager from './BaseManager'
import fs from 'fs'
import path from 'path'
import BotClient from '@structures/BotClient'
import { BaseCommand, MessageCommand, SlashCommand } from '@structures/Command'
import { InteractionType } from '@utils/Constants'

export default class CommandManager extends BaseManager {
  private logger = new Logger('CommandManager')
  private commands: BotClient['commands']

  public constructor(client: BotClient) {
    super(client)

    this.commands = client.commands
  }

  public load(commandPath: string = path.join(__dirname, '../commands')): void {
    this.logger.debug('Loading commands...')

    const commandFolder = fs.readdirSync(commandPath)

    try {
      commandFolder.forEach((folder) => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              const command =
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(`../commands/${folder}/${commandFile}`).default

              if (!command.data.name ?? !command.name)
                return this.logger.debug(
                  `Command ${commandFile} has no name. Skipping.`
                )

              this.commands.set(command.data.name ?? command.name, command)

              this.logger.debug(`Loaded command ${command.name}`)
            } catch (error: any) {
              this.logger.error(
                `Error loading command '${commandFile}'.\n` + error.stack
              )
            } finally {
              this.logger.debug(
                `Succesfully loaded commands. count: ${this.commands.size}`
              )
              // eslint-disable-next-line no-unsafe-finally
              return this.commands
            }
          })
        } catch (error: any) {
          this.logger.error(
            `Error loading command folder '${folder}'.\n` + error.stack
          )
        }
      })
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  public get(commandName: string): Command | undefined {
    let command = this.commands.get(commandName)

    command =
      command ??
      this.commands
        .filter(
          (c) =>
            CommandManager.isMessageCommand(c) &&
            c.data.aliases?.includes(commandName)
        )
        .first()

    return command
  }

  public reload(commandPath: string = path.join(__dirname, '../commands')) {
    this.logger.debug('Reloading commands...')

    this.commands.clear()
    try {
      this.load(commandPath)
    } finally {
      this.logger.debug('Succesfully reloaded commands.')
      // eslint-disable-next-line no-unsafe-finally
      return { message: '[200] Succesfully reloaded commands.' }
    }
  }

  public static isSlash(command: Command | undefined): command is SlashCommand {
    return command instanceof BaseCommand && command.slash
      ? true
      : command instanceof SlashCommand
      ? true
      : false
  }

  public static isMessageCommand(command?: Command): command is MessageCommand {
    return command instanceof MessageCommand
      ? true
      : command instanceof BaseCommand
      ? true
      : false
  }

  public async slashCommandSetup(
    guildID: string
  ): Promise<ApplicationCommandDataResolvable[] | undefined> {
    this.logger.scope = 'CommandManager: SlashSetup'
    const rest = new REST().setToken(this.client.token!)

    const interactions: Collection<string, InteractionData> = new Collection()

    this.client.interactions.forEach((command) => {
      if (command.type === InteractionType.ContextMenu) {
        interactions.set(command.data.name, command.data)
      }
    })

    this.client.commands.forEach((command) => {
      if (CommandManager.isSlash(command)) {
        interactions.set(
          command.data.name ?? command.slash?.data.name,
          command.slash ? command.slash?.data : command.data
        )
      }
    })

    if (!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)

      await rest
        .put(Routes.applicationCommands(this.client.application!.id), {
          body: interactions.toJSON()
        })
        .then(() =>
          this.logger.info(
            `Successfully registered application global commands.`
          )
        )

      return interactions.toJSON()
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)
      const commands = await this.client.application?.commands
        .fetch()
        .then((cmd) => cmd.map((cmd) => cmd.name))

      const resolvedData = interactions.filter((cmd) =>
        commands ? !commands.includes(cmd.name) : true
      )

      await rest
        .put(
          Routes.applicationGuildCommands(this.client.application!.id, guildID),
          {
            body: resolvedData.toJSON()
          }
        )
        .then(() =>
          this.logger.info(
            `Successfully registered server ${guildID} server commands.`
          )
        )

      return resolvedData.toJSON()
    }
  }
}
