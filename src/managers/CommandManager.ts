import { ApplicationCommandDataResolvable } from 'discord.js'
import { BaseCommand, Command, SlashCommand } from '../../typings/structures'

import Logger from '../utils/Logger'
import BaseManager from './BaseManager'
import fs from 'fs'
import path from 'path'
import BotClient from '../structures/BotClient'

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
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const command = require(`../commands/${folder}/${commandFile}`).default

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

  public get(commandName: string): BaseCommand | undefined {
    let command
    if (this.client.commands.has(commandName))
      return (command = this.client.commands.get(commandName))

    this.client.commands.forEach((cmd) => {
      if (this.isSlash(cmd) && cmd.data.name === commandName)
        return (command = cmd)
      // @ts-ignore
      if (cmd.data.aliases.includes(commandName)) return (command = cmd)
    })

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

  public isSlash(command: BaseCommand | undefined): command is SlashCommand {
    //return command?.options.slash ?? false
    return (command as Command)?.slash
      ? true
      : (command as SlashCommand)?.options?.isSlash
      ? true
      : false
  }

  public async slashCommandSetup(
    guildID: string
  ): Promise<ApplicationCommandDataResolvable[] | undefined> {
    this.logger.scope = 'CommandManager: SlashSetup'

    const slashCommands: any[] = []
    this.client.commands.forEach((command: BaseCommand) => {
      if (this.isSlash(command)) {
        slashCommands.push(
          command.slash ? command.slash?.data.toJSON() : command.data.toJSON()
        )
      }
    })

    if (!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)

      for (const command of slashCommands) {
        const commands = await this.client.application?.commands.fetch()
        const cmd = commands?.find((cmd) => cmd.name === command.name)
        if (!cmd) {
          await this.client.application?.commands
            .create(command)
            .then((guilds) =>
              this.logger.info(
                `Succesfully created command ${command.name} at ${guilds.name}(${guilds.id}) guild`
              )
            )
        }
      }
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)

      const guild = this.client.guilds.cache.get(guildID)

      for (const command of slashCommands) {
        const commands = await guild?.commands.fetch()
        const cmd = commands?.find((cmd) => cmd.name === command.name)
        if (!cmd) {
          await guild?.commands
            .create(command)
            .then((guild) =>
              this.logger.info(
                `Succesfully created command ${command.name} at ${guild.name} guild`
              )
            )
        }
      }

      return slashCommands
    }
  }
}
