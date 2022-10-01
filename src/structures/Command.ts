import {
  InteractionData,
  MessageCommandFuntion,
  MessageCommandOptions,
  SlashCommandFunction,
  SlashCommandOptions
} from '@types'

/**
 * @example
 * export default new SlashCommand(
 *    new SlashCommandBuilder()
 *      .setName('ping')
 *      .setDescription('ping, pong').toJSON(),
 *    async (client, interaction) => {
 *      interaction.reply('Pong!')
 *  })
 */
export class SlashCommand {
  slash?: SlashCommand
  constructor(
    public data: InteractionData,
    public execute: SlashCommandFunction,
    public options?: SlashCommandOptions
  ) {}
}

/**
 * @example
 * export default new MessageCommand(
 *  {
 *     name: 'ping',
 *     aliases: ['pong']
 *  },
 *  async (client, message, args) => {
 *    message.reply('Pong!')
 *  }
 * )
 */
export class MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion
  ) {}
}

/**
 * @example
 * export default new BaseCommand({
 *    name: 'ping',
 *    aliases: ['pong']
 * }, async (client, message, args) => {
 *    message.reply('pong!')
 * }, {
 *    new SlashCommandBuilder()
 *      .setName('ping')
 *      .setDescription('ping, pong').toJSON(),
 *    async (client, interaction) => {
 *      interaction.reply('Pong!')
 *    }
 * })
 */
export class BaseCommand extends MessageCommand {
  constructor(
    public data: MessageCommandOptions,
    public execute: MessageCommandFuntion,
    public slash?: SlashCommand | undefined
  ) {
    super(data, execute)
  }
}
