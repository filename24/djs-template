module.exports = {
  bot: {
    options: {
      intents: [32767],
      allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
    },
    token: '',
    owners: [],
    prefix: '!',
    cooldown: 2000,
  },

  database: {
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