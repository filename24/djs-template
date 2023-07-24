import config from '../config.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStream } from 'rotating-file-stream';
import { Logger as BaseLogger } from 'tslog';
export default class Logger extends BaseLogger {
    stream = createStream(join(dirname(fileURLToPath(import.meta.url)), '../../logs/latest.log'), {
        size: '10M',
        interval: '1d',
        compress: 'gzip'
    });
    constructor(scope) {
        super({
            name: scope,
            type: 'pretty',
            prettyLogTimeZone: 'local',
            prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} [ {{logLevelName}} ] [ {{name}} ]  ',
            minLevel: config.logger.dev ? 2 /* LevelType.Debug */ : config.logger.level
        });
        this.attachTransport((data) => {
            this.stream.write(JSON.stringify(data) + '\n');
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUE7QUFDM0IsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUN4QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUE7QUFDbkQsT0FBTyxFQUFFLE1BQU0sSUFBSSxVQUFVLEVBQVcsTUFBTSxPQUFPLENBQUE7QUFHckQsTUFBTSxDQUFDLE9BQU8sT0FBTyxNQUFPLFNBQVEsVUFBbUI7SUFDOUMsTUFBTSxHQUFHLFlBQVksQ0FDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLEVBQ3RFO1FBQ0UsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxNQUFNO0tBQ2pCLENBQ0YsQ0FBQTtJQUVELFlBQVksS0FBYTtRQUN2QixLQUFLLENBQUM7WUFDSixJQUFJLEVBQUUsS0FBSztZQUNYLElBQUksRUFBRSxRQUFRO1lBQ2QsaUJBQWlCLEVBQUUsT0FBTztZQUMxQixpQkFBaUIsRUFDZix3RkFBd0Y7WUFDMUYsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMseUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDcEUsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YifQ==