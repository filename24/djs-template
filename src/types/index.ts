import { PrismaClientOptions } from '@prisma/client/runtime'
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ClientOptions,
  ColorResolvable,
  ContextMenuCommandInteraction,
  HexColorString,
  Interaction,
  Message,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  ShardingManagerOptions
} from 'discord.js'
import { ReportType } from '../src/utils/Constants'

export interface ErrorReportOptions {
  executer:
    | Message<true>
    | ChatInputCommandInteraction<'cached'>
    | ContextMenuCommandInteraction<'cached'>
    | SelectMenuInteraction<'cached'>
    | ButtonInteraction<'cached'>
    | ModalSubmitInteraction<'cached'>
    | undefined
  isSend?: boolean
}

export type IConfig = {
  BUILD_VERSION: string
  BUILD_NUMBER: string
  devGuildID: string
  githubToken?: string
  name: string
  repository?: string
} & { logger: LoggerConfig } & { bot: BotConfig } & {
  database?: Partial<DatabaseConfig>
} & { report: ErrorReportConfig }

export interface LoggerConfig {
  level: LevelType
  dev: boolean
}

export interface ErrorReportConfig {
  type: ReportType
  webhook: {
    url: string
  }
  text: {
    guildID: string
    channelID: string
  }
}
/**
 * @deprecated Database config is not supported use 'prisma/schema.prisma'
 */
export interface DatabaseConfig {
  type: DatabaseType
  url: string
  options: PrismaClientOptions
}
export interface BotConfig {
  sharding: boolean
  shardingOptions?: ShardingManagerOptions
  options: ClientOptions
  token: string
  owners: string[]
  prefix: string
  cooldown?: number
}

export type DatabaseType = 'mongodb' | 'prisma'

export type LevelType =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'
  | 'chat'

export type EmbedType =
  | 'default'
  | 'error'
  | 'success'
  | 'warn'
  | 'info'
  | HexColorString

export * from './structures'
export * from './command'
