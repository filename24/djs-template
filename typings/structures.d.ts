import { SlashCommandBuilder } from '@discordjs/builders'
import {
  Message,
  ClientEvents,
  Awaitable,
  CommandInteraction
} from 'discord.js'
import BotClient from 'src/structures/BotClient'

export interface MessageCommnad {
  data: MessageCommandOptions
  execute: MessageCommandFuntion
}
export interface Command extends MessageCommnad {
  isSlash?: boolean
  slash?: SlashCommand
}

export interface SlashCommand {
  data: SlashCommandBuilder
  execute: SlashCommandFunction
  options?: SlashCommandOptions
  slash?: SlashCommand
}

export interface MessageCommandOptions {
  name: string
  description?: string
  aliases: string[]
}

export type MessageCommandFuntion = (
  client: BotClient,
  message: Message,
  args: string[]
) => Awaitable<void> | Promise<any>

export type SlashCommandFunction = (
  client: BotClient,
  interaction: CommandInteraction
) => Awaitable<void>

export interface SlashCommandOptions {
  name: string
  isSlash?: boolean
}

export interface Event {
  name: keyof ClientEvents
  options?: EventOptions
  execute: (
    client: BotClient,
    ...args: ClientEvents[keyof ClientEvents]
  ) => Awaitable<void>
}

export type EventFunction<E extends keyof ClientEvents> = (
  client: BotClient,
  ...args: ClientEvents[E]
) => Awaitable<void>

export interface EventOptions {
  once: boolean
}

export type BaseCommand = MessageCommnad | SlashCommand | Command
