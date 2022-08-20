"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: 'ping',
    description: '핑을 측정합니다.',
    aliases: ['핑', '측정', 'vld']
}, async (client, message, args) => {
    let embed = new Embed_1.default(client, 'warn').setTitle('핑 측정중...');
    let m = await message.reply({
        embeds: [embed]
    });
    embed = new Embed_1.default(client, 'success').setTitle('PONG!').addFields([
        {
            name: '메세지 응답속도',
            value: `${Number(m.createdAt) - Number(message.createdAt)}ms`,
            inline: true
        },
        {
            name: 'API 반응속도',
            value: `${client.ws.ping}ms`,
            inline: true
        },
        {
            name: '업타임',
            value: `<t:${(Number(client.readyAt) / 1000) | 0}:R>`,
            inline: true
        }
    ]);
    m.edit({
        embeds: [embed]
    });
}, {
    data: new builders_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('핑을 측정합니다.')
        .toJSON(),
    options: {
        name: 'ping',
        isSlash: true
    },
    async execute(client, interaction) {
        let PingEmbed = new Embed_1.default(client, 'success')
            .setTitle('핑 측정')
            .addFields([
            {
                name: '메세지 응답속도',
                value: `${Number(Date.now()) - Number(interaction.createdAt)}ms`,
                inline: true
            },
            {
                name: 'API 반응속도',
                value: `${client.ws.ping}ms`,
                inline: true
            },
            {
                name: '업타임',
                value: `<t:${(Number(client.readyAt) / 1000) | 0}:R>`,
                inline: true
            }
        ]);
        interaction.reply({ embeds: [PingEmbed] });
    }
});
