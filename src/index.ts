import { ShardingManager } from 'discord.js'
import config from '../config'
import chalk from 'chalk'
import { name } from '../package.json'
import Logger from './utils/Logger'

const logger = new Logger('shard')

console.log(
  chalk.cyanBright(`
                  =========================================================


                              ${name}@${config.BUILD_NUMBER}
                            Version : ${config.BUILD_VERSION}


                  =========================================================`)
)

if (!config.bot.sharding) {
  require('./bot.ts')
} else {
  const manager = new ShardingManager(
    './src/bot.ts',
    config.bot.shardingOptions
  )

  manager.spawn()
  manager.on('shardCreate', async (shard) => {
    logger.info(`Shard #${shard.id} created.`)
  })
}
