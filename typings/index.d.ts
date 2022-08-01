import { PrismaClientOptions } from '@prisma/client/runtime'
import {
  ChatInputCommandInteraction,
  ClientOptions,
  CommandInteraction,
  Interaction,
  Message,
  ShardingManagerOptions
} from 'discord.js'

export interface ErrorReportOptions {
  executer: Message | Interaction | undefined
  isSend?: boolean
}

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
    type: ReportType
    webhook: {
      url: string
    }
    text: {
      guildID: string
      channelID: string
    }
  }
  database?: {
    /**
     * @deprecated Type is now 'prisma' not change use 'prisma/schema.prisma'
     */
    type: DatabaseType
    /**
     * @deprecated This option not used anymore use 'prisma/schema.prisma'
     */
    url: string
    options?: PrismaClientOptions
  }
  logger: {
    level: LevelType
    dev: boolean
  }
}

export type DatabaseType = 'mongodb' | 'prisma'
export type ReportType = 'webhook' | 'text'
export type LevelType =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'
  | 'chat'
export type EmbedType = 'default' | 'error' | 'success' | 'warn' | 'info'
