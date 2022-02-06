import { SlashCommandBuilder } from '@discordjs/builders'
import {
  MessageCommandFuntion,
  MessageCommandOptions,
  SlashCommandFunction,
  SlashCommandOptions
} from '../../typings/structures'

export class SlashCommand {
  constructor(
    public data: SlashCommandBuilder,
    public execute: SlashCommandFunction,
    public options?: SlashCommandOptions
  ) {}
}

export class MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion
  ) {}
}

export class BaseCommand extends MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion,
    public slash?: SlashCommand | undefined
  ) {
    super(data, execute)
  }
}
