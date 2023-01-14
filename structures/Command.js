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
    data;
    execute;
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
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
