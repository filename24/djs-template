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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUE7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFHZDtJQUNBO0lBQ0E7SUFKVCxLQUFLLENBQWU7SUFDcEIsWUFDUyxJQUFxQixFQUNyQixPQUE2QixFQUM3QixPQUE2QjtRQUY3QixTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQUM3QixZQUFPLEdBQVAsT0FBTyxDQUFzQjtJQUNuQyxDQUFDO0NBQ0w7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBRWhCO0lBQ0E7SUFGVCxZQUNTLElBQTJCLEVBQzNCLE9BQThCO1FBRDlCLFNBQUksR0FBSixJQUFJLENBQXVCO1FBQzNCLFlBQU8sR0FBUCxPQUFPLENBQXVCO0lBQ3BDLENBQUM7Q0FDTDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sT0FBTyxXQUFZLFNBQVEsY0FBYztJQUVwQztJQUNBO0lBQ0E7SUFIVCxZQUNTLElBQTJCLEVBQzNCLE9BQThCLEVBQzlCLEtBQWdDO1FBRXZDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFKYixTQUFJLEdBQUosSUFBSSxDQUF1QjtRQUMzQixZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQUM5QixVQUFLLEdBQUwsS0FBSyxDQUEyQjtJQUd6QyxDQUFDO0NBQ0YifQ==