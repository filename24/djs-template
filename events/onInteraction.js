"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const InteractionManager_1 = __importDefault(require("../managers/InteractionManager"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('interactionCreate', async (client, interaction) => {
    const interactionManager = new InteractionManager_1.default(client);
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
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
    interactionManager.cacheEvent(interaction);
});
