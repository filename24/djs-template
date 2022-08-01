"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Interaction_1 = require("../../structures/Interaction");
exports.default = new Interaction_1.ContextMenu('contextMenu', new discord_js_1.ContextMenuCommandBuilder()
    .setName('context')
    .setType(discord_js_1.ApplicationCommandType.Message)
    .toJSON(), async (client, interaction) => { });
