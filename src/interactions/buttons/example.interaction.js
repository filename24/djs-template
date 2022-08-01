"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = require("../../structures/Interaction");
exports.default = new Interaction_1.Button('button', async (client, interaction) => {
    interaction.reply('You clicked the button!');
});
