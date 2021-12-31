require('module-alias')()

const Logger = require('./utils/Logger')
const { ShardingManager } = require('discord.js')

let config = require('../config')
let logger = new Logger('main')

console.log(require('chalk').cyanBright(`
=========================================================

            ${require('../package.json').name}@${config.BUILD_NUMBER}
          Version : ${config.BUILD_VERSION}

=========================================================
`))

if(!config.bot.sharding) {
  require('./bot.js')
} else {
  let manager = new ShardingManager('./src/bot.js', config.bot.shardingOptions)

  manager.spawn()
  manager.on('shardCreate', async (shard) => {
    logger.debug(`Shard #${shard.id} created.`)
  })
}