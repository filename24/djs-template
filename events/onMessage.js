import { Event } from '../structures/Event.js';
import CommandManager from '../managers/CommandManager.js';
import ErrorManager from '../managers/ErrorManager.js';
export default new Event('messageCreate', async (client, message) => {
    const commandManager = new CommandManager(client);
    const errorManager = new ErrorManager(client);
    if (message.author.bot)
        return;
    if (!message.inGuild())
        return;
    if (!message.content.startsWith(client.config.bot.prefix))
        return;
    const args = message.content
        .slice(client.config.bot.prefix.length)
        .trim()
        .split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    const command = commandManager.get(commandName);
    await client.eval.run(message);
    try {
        await command?.execute(client, message, args);
    }
    catch (error) {
        errorManager.report(error, { executer: message, isSend: true });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25NZXNzYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9vbk1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ3pDLE9BQU8sY0FBYyxNQUFNLDBCQUEwQixDQUFBO0FBQ3JELE9BQU8sWUFBWSxNQUFNLHdCQUF3QixDQUFBO0FBR2pELGVBQWUsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDakQsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFN0MsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFBRSxPQUFNO0lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQUUsT0FBTTtJQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQUUsT0FBTTtJQUVqRSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTztTQUN6QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN0QyxJQUFJLEVBQUU7U0FDTixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUE7SUFDL0MsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFxQixDQUFtQixDQUFBO0lBRTNFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFOUIsSUFBSTtRQUNGLE1BQU0sT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQzlDO0lBQUMsT0FBTyxLQUFVLEVBQUU7UUFDbkIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ2hFO0FBQ0gsQ0FBQyxDQUFDLENBQUEifQ==