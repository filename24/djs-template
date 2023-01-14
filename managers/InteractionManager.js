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
