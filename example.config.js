const fs = require('fs')

let BUILD_NUMBER = fs.readFileSync('.git/HEAD').toString().trim()

if (BUILD_NUMBER?.indexOf(':') === -1) {
  BUILD_NUMBER
} else {
  try {
    BUILD_NUMBER = fs.readFileSync('.git/' + BUILD_NUMBER?.substring(5)).toString().trim().substring(0, 6)
  } catch (e) {
    BUILD_NUMBER = undefined
  }
}

module.exports = {
  BUILD_VERSION : '0.0.1-dev',
  BUILD_NUMBER,
  githubToken: '',
  bot: {
    sharding: false,
    /**
     * @type {import('discord.js').ShardingManagerOptions}
     */
    shardingOptions: {
      totalShards: 3,
      respawn: true,
    },
    options: {
      intents: [32767],
      allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
    },
    token: '',
    owners: [],
    prefix: '!',
    cooldown: 2000,
  },
  report: {
    /**
     * @type {'webhook', 'text'}
     */
    type: 'webhook',
    webhook: {
      url: '',
    },
    text: {
      guildID: '',
      channelID: ''
    }
  },
  database: {
    /**
     * @type {'mongodb'|'sqlite'}
     */
    type: 'mongodb',
    url: 'mongodb://localhost:27017/',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  logger: {
    level: 'chat',
    dev: false,
  }
}