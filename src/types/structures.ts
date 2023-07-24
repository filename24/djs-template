import type {
  Message,
  ClientEvents,
  ChatInputCommandInteraction,
  Interaction,
  RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js'
import {
  BaseCommand as Command,
  SlashCommand,
  MessageCommand
} from '@structures/Command'
import BotClient from '@structures/BotClient'

export interface MessageCommandOptions {
  name: string
  description?: string
  aliases: string[]
}

export type MessageCommandFuntion = (
  client: BotClient,
  message: Message<true>,
  args: string[]
) => Promise<any>

export type SlashCommandFunction = (
  client: BotClient,
  interaction: ChatInputCommandInteraction
) => Promise<any>

export interface SlashCommandOptions {
  name: string
  isSlash?: boolean
}

export type EventFunction<E extends keyof ClientEvents> = (
  client: BotClient,
  ...args: ClientEvents[E]
) => Promise<any>

export interface EventOptions {
  once: boolean
}

export type BaseInteractionFunction<T = Interaction> = (
  client: BotClient,
  interaction: T
) => Promise<any>

export type BaseCommand = MessageCommand | SlashCommand | Command
export type InteractionData = RESTPostAPIApplicationCommandsJSONBody
