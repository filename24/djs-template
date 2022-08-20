import {
  InteractionData,
  MessageCommandFuntion,
  MessageCommandOptions,
  SlashCommandFunction,
  SlashCommandOptions
} from '@types'

export class SlashCommand {
  slash?: SlashCommand
  constructor(
    public data: InteractionData,
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
