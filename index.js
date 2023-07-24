import 'dotenv/config';
import { ShardingManager } from 'discord.js';
import { setTimeout } from 'timers/promises';
import { readFileSync } from 'fs';
import { join } from 'path';
import config from './config.js';
import chalk from 'chalk';
import Logger from './utils/Logger.js';
const logger = new Logger('ShardManager');
const main = async () => {
    console.log(chalk.cyanBright(`
                    =========================================================
  
  
                                ${config.name}@${config.BUILD_NUMBER}
                              Version : ${config.BUILD_VERSION}
  
  
                    =========================================================`));
    if (!config.bot.sharding) {
        import('./bot.js');
    }
    else {
        try {
            if (!readFileSync(join(__dirname, './bot.ts')))
                return;
            for (let index = 0; index < 6; index++) {
                console.log(' ');
            }
            logger.warn('Sharding system not supported typescript file');
            for (let index = 0; index < 6; index++) {
                console.log(' ');
            }
            await setTimeout(1500);
            import('./bot.js');
        }
        catch (e) {
            const manager = new ShardingManager('./build/bot.js', config.bot.shardingOptions);
            manager.spawn();
            manager.on('shardCreate', async (shard) => {
                logger.info(`Shard #${shard.id} created.`);
            });
        }
    }
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUM1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDNUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLElBQUksQ0FBQTtBQUNqQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBQzNCLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQTtBQUNoQyxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUE7QUFDekIsT0FBTyxNQUFNLE1BQU0sZUFBZSxDQUFBO0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRXpDLE1BQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsS0FBSyxDQUFDLFVBQVUsQ0FBQzs7OztrQ0FJYSxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxZQUFZOzBDQUMxQixNQUFNLENBQUMsYUFBYTs7OzhFQUdnQixDQUFDLENBQzVFLENBQUE7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7UUFDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ2hCO1NBQU07UUFDTCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUFFLE9BQU07WUFDdEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUNqQjtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQTtZQUM1RCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ2pCO1lBQ0QsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ2hCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FDakMsZ0JBQWdCLEVBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUMzQixDQUFBO1lBRUQsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQ2YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDNUMsQ0FBQyxDQUFDLENBQUE7U0FDSDtLQUNGO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsSUFBSSxFQUFFLENBQUEifQ==