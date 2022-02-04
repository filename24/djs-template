import { ApplicationCommandDataResolvable, Collection } from 'discord.js'
import { BaseCommand, Command, MessageCommnad, SlashCommand } from '../../typings'

import Logger from '../utils/Logger'
import BaseManager from './BaseManager'
import fs = require('fs')
import path = require('path')
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
      commandFolder.forEach(folder => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              if (!commandFile.endsWith('.ts')) return this.logger.warn(`Not a TypeScript file ${commandFile}. Skipping.`)

              let { default: command } = require(`../commands/${folder}/${commandFile}`)

              if (!command.data.name ?? !command.name) return this.logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.data.name ?? command.name, command)

              this.logger.debug(`Loaded command ${command.name}`)
            } catch (error: any) {
              this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
              // eslint-disable-next-line no-unsafe-finally
              return this.commands
            }
          })
        } catch (error: any) {
          this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  public get(commandName: string): BaseCommand | undefined {
    if (this.client.commands.has(commandName))
      return this.client.commands.get(commandName)

    this.client.commands.forEach(cmd => {
      if (this.isSlash(cmd)) return;
      if (cmd.data.aliases.includes(commandName))
        return cmd
    })

    return undefined
  }

  public reload(commandPath: string = path.join(__dirname, '../commands')) {
    this.logger.debug('Reloading commands...')

    this.commands.clear()
    try {
      this.load(commandPath)
    } finally {
      this.logger.debug('Succesfully reloaded commands.')
      return '[200] Succesfully reloaded commands.'
    }
  }

  public isSlash(command: BaseCommand | undefined): command is SlashCommand {
    //return command?.options.slash ?? false
    return (command as Command)?.slash ? true : (command as SlashCommand)?.options?.isSlash ? true : false
  }

  public async slashCommandSetup(guildID: string): Promise<ApplicationCommandDataResolvable[] | undefined> {
    this.logger.scope = 'CommandManager: SlashSetup'

    let slashCommands: any[] = []
    this.client.commands.forEach((command: BaseCommand) => {
      if (this.isSlash(command)) {

        slashCommands.push(command.slash ? command.slash?.data.toJSON() : command.data.toJSON())
      }
    })

    if (!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)

      for (let command of slashCommands) {
        let commands = await this.client.application?.commands.fetch()
        let cmd = commands?.find(cmd => cmd.name === command.name)
        if (!cmd) {
          await this.client.application?.commands.create(command).then((guilds) => this.logger.info(`Succesfully created command ${command.name} at ${guilds.name}(${guilds.id}) guild`))
        }
      }
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)

      let guild = this.client.guilds.cache.get(guildID)

      for (let command of slashCommands) {
        let commands = await guild?.commands.fetch()
        let cmd = commands?.find(cmd => cmd.name === command.name)
        if (!cmd) {
          await guild?.commands.create(command).then((guild) => this.logger.info(`Succesfully created command ${command.name} at ${guild.name} guild`))
        }
      }

      return slashCommands

    }
  }
}