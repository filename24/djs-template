"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../structures/Event");
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const discord_js_1 = require("discord.js");
exports.default = new Event_1.Event('messageCreate', async (client, message) => {
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
    if (message.author.bot)
        return;
    if (message.channel.type === discord_js_1.ChannelType.DM)
        return;
    if (!message.content.startsWith(client.config.bot.prefix))
        return;
    const args = message.content
        .slice(client.config.bot.prefix.length)
        .trim()
        .split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    const command = commandManager.get(commandName);
    try {
        await command?.execute(client, message, args);
    }
    catch (error) {
        errorManager.report(error, { executer: message, isSend: true });
    }
});
