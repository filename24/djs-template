import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandDataResolvable, Awaitable, ClientEvents, ClientOptions, CommandInteraction, Message, ShardingManagerOptions, SnowflakeUtil } from "discord.js";
import { MongooseOptions } from "mongoose";
import BotClient from "../src/structures/BotClient";


export interface Event {
    name: keyof ClientEvents;
    options?: EventOptions;
    execute: (client: BotClient, ...args: ClientEvents[keyof ClientEvents]) => Awaitable<void>;
}

export type LevelType =
    | "fatal"
    | "error"
    | "warn"
    | "info"
    | "verbose"
    | "debug"
    | "chat"

export type EmbedType = 'default' | 'error' | 'success' | 'warn' | 'info'

export interface MessageCommnad {
    data: MessageCommandOptions
    execute: MessageCommandFuntion
}
export interface Command extends MessageCommnad {
    isSlash?: boolean
    slash?: SlashCommand
}

export interface SlashCommand {
    data: SlashCommandBuilder
    execute: SlashCommandFunction
    options?: SlashCommandOptions
    slash?: SlashCommand
}


export type BaseCommand = MessageCommnad | SlashCommand | Command

export type EventFunction<E extends keyof ClientEvents> = (
    client: BotClient,
    ...args: ClientEvents[E]
) => Awaitable<void>;


export interface EventOptions {
    once: boolean;
}

export interface ErrorReportOptions {
    executer: Message | CommandInteraction | undefined
    isSend?: boolean
}

export type SlashCommandFunction = (
    client: BotClient,
    interaction: CommandInteraction
) => Awaitable<void>;

export interface SlashCommandOptions {
    name: string;
    isSlash?: boolean;
}

export interface MessageCommandOptions {
    name: string
    description?: string
    aliases: string[]
}

export type MessageCommandFuntion = (
    client: BotClient,
    message: Message,
    args: string[]
) => Awaitable<void>
export interface IConfig {
    BUILD_VERSION: string
    BUILD_NUMBER: string | null
    githubToken?: string
    bot: {
        sharding: boolean
        shardingOptions?: ShardingManagerOptions
        options: ClientOptions
        token: string
        owners: string[]
        prefix: string
        cooldown?: number
    }
    report: {
        type: "webhook" | "text"
        webhook: {
            url: string
        },
        text: {
            guildID: string
            channelID: string
        },
    },
    database: {
        type: "mongodb" | "sqlite"
        url: string
        options: any
    },
    logger: {
        level: LevelType
        dev: boolean
    },
}

export interface GithubCommitAPI {
    sha: string
    commit: {
        author: {
            name: string
            email: string
            date: string
        }
        committer: {
            name: string
            email: string
            date: string
        }
        message: string
        tree: {
            sha: string
            url: string
        }
        url: string
        comment_count: number
        verification: {
            verified: boolean
            reason: string
            signature: null
            payload: null
        }
    }
    url: string
    html_url: string
    comments_url: string
    author: {
        login: string
        id: number
        node_id: string
        avatar_url: string
        gravatar_id: string
        url: string
        html_url: string
        followers_url: string
        following_url: string
        gists_url: string
        starred_url: string
        subscriptions_url: string
        organizations_url: string
        repos_url: string
        events_url: string
        received_events_url: string
        type: string
        site_admin: boolean
    }
}