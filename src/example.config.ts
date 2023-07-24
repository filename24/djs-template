import { execSync } from 'child_process'
import { IConfig } from '@types'
import { LevelType, ReportType } from './utils/Constants.js'

const config: IConfig = {
  BUILD_NUMBER: execSync('git rev-parse --short HEAD').toString().trim(),
  BUILD_VERSION: '0.1.5',
  devGuildID: '',
  githubToken: '',
  name: 'DJS Template',
  bot: {
    sharding: false,
    options: {
      intents: [130815],
      allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
    },
    token: '',
    owners: [],
    prefix: '!',
    cooldown: 2000
  },
  report: {
    type: ReportType.Webhook,
    webhook: {
      url: ''
    },
    text: {
      guildID: '',
      channelID: ''
    }
  },
  logger: {
    level: LevelType.Info,
    dev: false
  }
}

export default config
