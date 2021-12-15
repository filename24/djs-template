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

export interface Config {
    bot: BotConfig;
    report: ReportConfig;
    database: DatabaseConfig;
    logger: LoggerConfig
}

export interface MessageCommand {
    name: string;
    description: string;
    aliases: string[];
    execute: (client: BotClient, message: Message, args: string[]) => Promise<void>;
}

export interface SlashCommand {
    name: string;
    description?: string;
    isSlash: true;
    data: SlashCommandBuilder;
    execute: (client: BotClient, interaction: CommandInteraction) => Promise<void>;
}

export interface Command extends MessageCommand {
    isSlash?: boolean;
    slash: SlashCommand;
}

export interface Event {
    name: ClientEvents;
    execute: (client: BotClient, ...args: any) => Promise<void>;
}

