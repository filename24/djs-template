import chalk from 'chalk'
import stripColor from 'strip-ansi'
import { createLogger, format, transports, addColors, Logger as iLogger, LeveledLogMethod } from 'winston'
const { printf, splat, colorize, timestamp, ms, combine } = format

let config = require('../../config')

let colors = {
  fatal: chalk.bgWhite.red.bold,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyanBright,
  chat: (text: string) => text,
  verbose: chalk.blueBright,
  debug: chalk.blue
}

let myFormat = printf(({
  level,
  message,
  label,
  timestamp,
  ms
}) => {
  const _level = stripColor(level)
  const colorizer = colors[_level]
  return `${chalk.grey(`[${timestamp}]`)} ${_level === 'chat' ? '' : `[${label}] `}${level} ${colorizer(message)} ${chalk.magentaBright(ms)}`
})

let myCustomLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    chat: 4,
    verbose: 5,
    debug: 6
  },
  colors: {
    fatal: 'whiteBG red bold',
    error: 'red',
    warn: 'yellow',
    info: 'white',
    chat: 'grey',
    verbose: 'cyan',
    debug: 'blue'
  }
}

addColors(myCustomLevels.colors)

interface CustomLogger extends iLogger {
  fatal: LeveledLogMethod
}

export default class Logger {
  public scope: string
  private logger: CustomLogger

  constructor(scope: string) {
    this.scope = scope

    this.logger = createLogger({
      levels: myCustomLevels.levels,
      transports: [
        new transports.Console({
          level: config.logger.dev ? 'debug' : config.logger.level,
          format: combine(
            splat(),
            colorize(),
            timestamp(),
            ms(),
            myFormat
          )
        })
      ]
    })
  }

  public log(message: string, ...args: any[]) {
    this.logger.info(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  public info(message: string, ...args: any[]) {
    this.logger.info(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  public warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  public error(message: string, ...args: any[]) {
    this.logger.error(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message message
   * @param  {...any} args 
   */
  public debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message message
   * @param  {...any} args 
   */
  public fatal(message: string, ...args: any[]) {
    this.logger.fatal(message, ...args, { label: this.scope })


    process.exit(1)
  }
}
