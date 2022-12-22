import { execSync } from 'child_process'
import { IConfig } from '@types'
import { ReportType } from './utils/Constants'

const config: IConfig = {
  BUILD_NUMBER: execSync('git rev-parse --short HEAD').toString().trim(),
  BUILD_VERSION: '0.1.4',
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
    level: 'chat',
    dev: false
  }
}

export default config
