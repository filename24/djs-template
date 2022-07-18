"use strict";
/* eslint-disable no-unused-vars */
// @ts-ignore
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
// Slash command and Message Command
const builders_1 = require("@discordjs/builders");
exports.default = {
    name: '',
    description: '',
    aliases: [],
    isSlash: false,
    async execute(client, message, args) {
    },
    slash: {
        name: '',
        data: new builders_1.SlashCommandBuilder()
            .setName('')
            .setDescription('')
            .toJSON(),
        async execute(client, interaction) {
        }
    }
};
exports.default = {
    name: '',
    description: '',
    aliases: [],
    isSlash: false,
    async execute(client, message, args) {
    },
};
exports.default = {
    name: '',
    description: '',
    isSlash: true,
    data: new builders_1.SlashCommandBuilder()
        .setName('')
        .setDescription('')
        .toJSON(),
    async execute(client, interaction) {
    }
};
