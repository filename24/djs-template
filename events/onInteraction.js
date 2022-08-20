"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const InteractionManager_1 = __importDefault(require("../managers/InteractionManager"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('interactionCreate', async (client, interaction) => {
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
    const interactionManager = new InteractionManager_1.default(client);
    if (!interaction.inCachedGuild())
        return;
    if (interaction.isChatInputCommand()) {
        if (interaction.user.bot)
            return;
        const command = commandManager.get(interaction.commandName);
        try {
            if (CommandManager_1.default.isSlash(command)) {
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
    else if (interaction.isButton()) {
        const interactionData = interactionManager.get(interaction.customId);
        if (!interactionData)
            return;
        if (interactionData.type !== 1 /* InteractionType.Button */)
            return;
        try {
            interactionData.execute(client, interaction);
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
    else if (interaction.isSelectMenu()) {
        const interactionData = interactionManager.get(interaction.customId);
        if (!interactionData)
            return;
        if (interactionData.type !== 2 /* InteractionType.Select */)
            return;
        try {
            interactionData.execute(client, interaction);
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
    else if (interaction.isContextMenuCommand() ||
        interaction.isUserContextMenuCommand() ||
        interaction.isMessageContextMenuCommand()) {
        const interactionData = interactionManager.get(interaction.commandName);
        if (!interactionData)
            return;
        if (interactionData.type !== 3 /* InteractionType.ContextMenu */)
            return;
        try {
            interactionData.execute(client, interaction);
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
    else if (interaction.type === discord_js_1.InteractionType.ModalSubmit) {
        const interactionData = interactionManager.get(interaction.customId);
        if (!interactionData)
            return;
        if (interactionData.type !== 4 /* InteractionType.Modal */)
            return;
        try {
            interactionData.execute(client, interaction);
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
    else if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
        const interactionData = interactionManager.get(interaction.commandName);
        if (!interactionData)
            return;
        if (interactionData.type !== 5 /* InteractionType.AutoComplete */)
            return;
        try {
            interactionData.execute(client, interaction);
        }
        catch (error) {
            errorManager.report(error);
        }
    }
});
