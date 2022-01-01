const BaseManager = require('./BaseManager')


class i18nManager extends BaseManager {
  constructor(client) {
    super(client)
  }

  async load() {
    // Todo: Load i18n files
  }
}

module.exports = i18nManager