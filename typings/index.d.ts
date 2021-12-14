import { SlashCommandBuilder } from "@discordjs/builders";
import { ClientEvents, ClientOptions, CommandInteraction, Message, SnowflakeUtil } from "discord.js";
import { MongooseOptions } from "mongoose";
import BotClient from "../src/structures/BotClient";

interface BotConfig {
    sharding: boolean;
    options: ClientOptions;
    token: string;
    owners: string[];
    prefix: string;
    cooldown: number;
}

interface ReportConfig {
    type: 'webhook' | 'chat';
    webhook?: {
        url: string;
    };
    text?: {
        guildID: string;
        channelID: string;
    };
}

interface DatabaseConfig {
    type: 'mongodb' | 'sqlite';
    url?: string;
    options?: MongooseOptions
}

interface LoggerConfig {
    level: string;
    dev: boolean;
}

interface Config {
    bot: BotConfig;
    report: ReportConfig;
    database: DatabaseConfig;
    logger: LoggerConfig
}

/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {string} description
 * @property {string} usage
 * @property {string[]} aliases
 * @property {boolean} [isSlash]
 * @property {import('@discordjs/builders').SlashCommandBuilder} [data]
 * @property {void} execute
 * @property {Object} [slash]
 * @property {string} slash.name
 * @property {string} slash.description
 * @property {import('@discordjs/builders').SlashCommandBuilder} slash.data
 * @property {void} slash.execute
 */
interface MessageCommand {
    name: string;
    description: string;
    aliases: string[];
    execute: (client: BotClient, message: Message, args: string[]) => Promise<void>;
}

interface SlashCommand {
    name: string;
    description?: string;
    isSlash: true;
    data: SlashCommandBuilder
    execute: (client: BotClient, interaction: CommandInteraction) => Promise<void>
}

interface Command extends MessageCommand{
    slash: SlashCommand
}

interface Event {
    name: ClientEvents;
    execute: (client: BotClient, ...args: any) => Promise<void>
}
