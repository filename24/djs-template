"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('interactionCreate', async (client, interaction) => {
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
    if (interaction.isChatInputCommand()) {
        if (interaction.user.bot)
            return;
        if (interaction.channel?.type === discord_js_1.ChannelType.DM)
            return interaction.reply('DM으로는 명령어 사용이 불가능해요');
        const command = commandManager.get(interaction.commandName);
        try {
            if (commandManager.isSlash(command)) {
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
});
