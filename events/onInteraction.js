import CommandManager from '../managers/CommandManager.js';
import ErrorManager from '../managers/ErrorManager.js';
import InteractionManager from '../managers/InteractionManager.js';
import { Event } from '../structures/Event.js';
export default new Event('interactionCreate', async (client, interaction) => {
    const interactionManager = new InteractionManager(client);
    const commandManager = new CommandManager(client);
    const errorManager = new ErrorManager(client);
    if (!interaction.inCachedGuild())
        return;
    if (interaction.isChatInputCommand()) {
        if (interaction.user.bot)
            return;
        const command = commandManager.get(interaction.commandName);
        try {
            if (CommandManager.isSlash(command)) {
                command.slash
                    ? await command.slash.execute(client, interaction)
                    : await command.execute(client, interaction);
            }
            //await interaction.deferReply().catch(() => { })
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
    interactionManager.cacheEvent(interaction);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25JbnRlcmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvb25JbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGNBQWMsTUFBTSwwQkFBMEIsQ0FBQTtBQUNyRCxPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQTtBQUNqRCxPQUFPLGtCQUFrQixNQUFNLDhCQUE4QixDQUFBO0FBQzdELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUV6QyxlQUFlLElBQUksS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUU7SUFDMUUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3pELE1BQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTdDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFO1FBQUUsT0FBTTtJQUV4QyxJQUFJLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1FBQ3BDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTTtRQUVoQyxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUMzRCxJQUFJO1lBQ0YsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsS0FBSztvQkFDWCxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDO29CQUNsRCxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTthQUMvQztZQUNELGlEQUFpRDtTQUNsRDtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtTQUNwRTtLQUNGO0lBRUQsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzVDLENBQUMsQ0FBQyxDQUFBIn0=