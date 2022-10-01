"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = exports.MessageCommand = exports.SlashCommand = void 0;
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
class SlashCommand {
    data;
    execute;
    options;
    slash;
    constructor(data, execute, options) {
        this.data = data;
        this.execute = execute;
        this.options = options;
    }
}
exports.SlashCommand = SlashCommand;
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
class MessageCommand {
    data;
    execute;
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
exports.MessageCommand = MessageCommand;
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
class BaseCommand extends MessageCommand {
    data;
    execute;
    slash;
    constructor(data, execute, slash) {
        super(data, execute);
        this.data = data;
        this.execute = execute;
        this.slash = slash;
    }
}
exports.BaseCommand = BaseCommand;
