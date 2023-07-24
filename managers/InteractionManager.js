import { dirname, resolve } from 'path';
import Logger from '../utils/Logger.js';
import BaseManager from './BaseManager.js';
import ErrorManager from './ErrorManager.js';
import { InteractionType as DInteractionType } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { readAllFiles } from '../utils/Utils.js';
export default class InteractionManager extends BaseManager {
    logger = new Logger('InteractionManager');
    interactions;
    constructor(client) {
        super(client);
        this.interactions = client.interactions;
    }
    async load(interactionPath = resolve(dirname(fileURLToPath(import.meta.url)), '../interactions')) {
        this.logger.debug('Loading interactions...');
        const interactionFiles = readAllFiles(interactionPath);
        await Promise.all(interactionFiles.map(async (interactionFile) => {
            try {
                const { default: interaction } = await import(pathToFileURL(interactionFile).toString());
                if (!interaction.customId)
                    return this.logger.debug(`interaction ${interactionFile} has no customId. Skipping.`);
                this.interactions.set(interaction.customId, interaction);
                this.logger.debug(`Loaded interaction ${interaction.customId}`);
            }
            catch (error) {
                this.logger.error(`Error loading interaction '${interactionFile}'.\n` + error.stack);
            }
        }));
        this.logger.info(`Succesfully loaded interactions. count: ${this.interactions.size}`);
        return this.interactions;
    }
    get(customId) {
        return this.interactions.find((_, id) => {
            if (typeof id === 'string' && id === customId)
                return true;
            id.includes(customId);
        });
    }
    async cacheEvent(interaction) {
        const errorManager = new ErrorManager(this.client);
        if (!interaction.inCachedGuild())
            return;
        if (interaction.isButton()) {
            const interactionData = this.get(interaction.customId);
            if (!interactionData)
                return;
            if (interactionData.type !== 1 /* InteractionType.Button */)
                return;
            try {
                interactionData.execute(this.client, interaction);
            }
            catch (error) {
                errorManager.report(error, { executer: interaction, isSend: true });
            }
        }
        else if (interaction.isAnySelectMenu()) {
            const interactionData = this.get(interaction.customId);
            if (!interactionData)
                return;
            if (interactionData.type !== 2 /* InteractionType.Select */)
                return;
            try {
                interactionData.execute(this.client, interaction);
            }
            catch (error) {
                errorManager.report(error, { executer: interaction, isSend: true });
            }
        }
        else if (interaction.isContextMenuCommand() ||
            interaction.isUserContextMenuCommand() ||
            interaction.isMessageContextMenuCommand()) {
            const interactionData = this.get(interaction.commandName);
            if (!interactionData)
                return;
            if (interactionData.type !== 3 /* InteractionType.ContextMenu */)
                return;
            try {
                interactionData.execute(this.client, interaction);
            }
            catch (error) {
                errorManager.report(error, { executer: interaction, isSend: true });
            }
        }
        else if (interaction.type === DInteractionType.ModalSubmit) {
            const interactionData = this.get(interaction.customId);
            if (!interactionData)
                return;
            if (interactionData.type !== 4 /* InteractionType.Modal */)
                return;
            try {
                interactionData.execute(this.client, interaction);
            }
            catch (error) {
                errorManager.report(error, { executer: interaction, isSend: true });
            }
        }
        else if (interaction.type === DInteractionType.ApplicationCommandAutocomplete) {
            const interactionData = this.get(interaction.commandName);
            if (!interactionData)
                return;
            if (interactionData.type !== 5 /* InteractionType.AutoComplete */)
                return;
            try {
                interactionData.execute(this.client, interaction);
            }
            catch (error) {
                errorManager.report(error);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25NYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hbmFnZXJzL0ludGVyYWN0aW9uTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUd2QyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUE7QUFFMUMsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUE7QUFFNUMsT0FBTyxFQUFFLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDOUMsTUFBTSxDQUFDLE9BQU8sT0FBTyxrQkFBbUIsU0FBUSxXQUFXO0lBQ2pELE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0lBQ2pDLFlBQVksQ0FBMkI7SUFFdkQsWUFBWSxNQUFpQjtRQUMzQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFYixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUE7SUFDekMsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQ2Ysa0JBQTBCLE9BQU8sQ0FDL0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ3ZDLGlCQUFpQixDQUNsQjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFFNUMsTUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUE7UUFFdEQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLGdCQUFnQixD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