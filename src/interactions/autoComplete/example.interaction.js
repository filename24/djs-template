"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = require("../../structures/Interaction");
exports.default = new Interaction_1.AutoComplete('autoComplete', async (client, interaction) => {
    interaction.respond([
        { name: 'data', value: 'data' },
        { name: 'for', value: 'for' },
        { name: 'autoComplete', value: 'autoComplete' }
    ]);
});
