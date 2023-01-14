import 'dotenv/config'
import { ShardingManager } from 'discord.js'
import { setTimeout } from 'timers/promises'
import { readFileSync } from 'fs'
import { join } from 'path'
import config from './config.js'
import chalk from 'chalk'
import Logger from '@utils/Logger'

const logger = new Logger('ShardManager')

const main = async () => {
  console.log(
    chalk.cyanBright(`
                    =========================================================
  
  
                                ${config.name}@${config.BUILD_NUMBER}
                              Version : ${config.BUILD_VERSION}
  
  
                    =========================================================`)
  )

  if (!config.bot.sharding) {
    import('./bot')
  } else {
    try {
      if (!readFileSync(join(__dirname, './bot.ts'))) return
      for (let index = 0; index < 6; index++) {
        console.log(' ')
      }
      logger.warn('Sharding system not supported typescript file')
      for (let index = 0; index < 6; index++) {
        console.log(' ')
      }
      await setTimeout(1500)
      import('./bot')
    } catch (e) {
      const manager = new ShardingManager(
        './build/bot.js',
        config.bot.shardingOptions
      )

      manager.spawn()
      manager.on('shardCreate', async (shard) => {
        logger.info(`Shard #${shard.id} created.`)
      })
    }
  }
}

main()
