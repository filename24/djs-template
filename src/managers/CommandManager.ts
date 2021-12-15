import { Collection } from 'discord.js'
import { Command, MessageCommand, SlashCommand } from '../../typings'

import Logger from '../utils/Logger'
import BaseManager from './BaseManager'
import fs = require('fs')
import path = require('path')
import BotClient from '../structures/BotClient'
import { SlashCommandBuilder } from '@discordjs/builders'

export default class CommandManager extends BaseManager {
  public logger = new Logger('CommandManager')
  public commands: Collection<string, Command>

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
              if (!commandFile.endsWith('.js')) return this.logger.warn(`Not a Javascript file ${commandFile}. Skipping.`)

              let command = require(`../commands/${folder}/${commandFile}`)

              if(!command.name) return this.logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.name, command)

              this.logger.debug(`Loaded command ${command.name}`)
            } catch (error) {
              this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
              // eslint-disable-next-line no-unsafe-finally
              return this.commands
            }
          })
        } catch (error) {
          this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  public get(commandName: string): Command {
    if(this.client.commands.has(commandName))
      return this.client.commands.get(commandName)
    else if(this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) 
      return this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    
  }

  public reload(commandPath: string = path.join(__dirname, '../commands')): void {
    this.logger.debug('Reloading commands...')

    this.commands.clear()
    try {
      this.load(commandPath)
    } finally {
      this.logger.debug('Succesfully reloaded commands.')
      return '[200] Succesfully reloaded commands.'
    }
  }

  private isSlash(command: Command|SlashCommand): this is SlashCommand {
    return (command as Command).slash !== undefined
  }

  public async slashCommandSetup(guildID: string): Promise<SlashCommandBuilder[]> {
    this.logger.scope = 'CommandManager: SlashSetup'

    let slashCommands = []
    this.client.commands.forEach((command: Command|SlashCommand)=> {
      if(this.isSlash(command)) {
        slashCommands.push(command.data)
      }
    })

    if(!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)
      
      this.client.application.commands.set(slashCommands).then((x) => {
        this.logger.info(`Succesfully set ${x.size} guilds`)
      })
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)

      let guild = this.client.guilds.cache.get(guildID)

      await guild.commands.set(slashCommands)

      return slashCommands
      
    }
  }
}