import config from 'config'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStream } from 'rotating-file-stream'
import { Logger as BaseLogger, ILogObj } from 'tslog'
import { LevelType } from './Constants.js'

export default class Logger extends BaseLogger<ILogObj> {
  public stream = createStream(
    join(dirname(fileURLToPath(import.meta.url)), '../../logs/latest.log'),
    {
      size: '10M',
      interval: '1d',
      compress: 'gzip'
    }
  )

  constructor(scope: string) {
    super({
      name: scope,
      type: 'pretty',
      prettyLogTimeZone: 'local',
      prettyLogTemplate:
        '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} [ {{logLevelName}} ] [ {{name}} ]  ',
      minLevel: config.logger.dev ? LevelType.Debug : config.logger.level
    })

    this.attachTransport((data) => {
      this.stream.write(JSON.stringify(data) + '\n')
    })
  }
}
