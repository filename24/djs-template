module.exports = {
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