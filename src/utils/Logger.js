const chalk = require('chalk')
const stripColor = require('strip-ansi')
const { createLogger, format, transports, addColors } = require('winston')
const { printf, splat, colorize, timestamp, ms, combine } = format

let config = require('../../config')

let colors = {
  fatal: chalk.bgWhite.red.bold,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyanBright,
  chat: text => text,
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

class Logger {
  /**
   * Logger constructor
   * @param {string} scope 
   */
  constructor(scope) {
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

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  log(message, ...args) {
    this.logger.info(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  info(message, ...args) {
    this.logger.info(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  warn(message, ...args) {
    this.logger.warn(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message 
   * @param  {...any} args 
   */
  error(message, ...args) {
    this.logger.error(message, ...args, { label: this.scope })
  }

  /**
   * 
   * @param {string} message message
   * @param  {...any} args 
   */
  debug(message, ...args) {
    this.logger.debug(message, ...args, { label: this.scope })
  }
  
  /**
   * 
   * @param {string} message message
   * @param  {...any} args 
   */
  fatal(message, ...args) {
    this.logger.fatal(message, ...args, { label: this.scope })


    process.exit(1)
  }
}

module.exports = Logger