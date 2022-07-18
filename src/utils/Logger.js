"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const winston_1 = require("winston");
const config_1 = __importDefault(require("../../config"));
const { printf, splat, colorize, timestamp, ms, combine } = winston_1.format;
const colors = {
    fatal: chalk_1.default.bgWhite.red.bold,
    error: chalk_1.default.red,
    warn: chalk_1.default.yellow,
    info: chalk_1.default.cyanBright,
    chat: (text) => text,
    verbose: chalk_1.default.blueBright,
    debug: chalk_1.default.blue
};
const myFormat = printf(({ level, message, label, ms }) => {
    const _level = (0, strip_ansi_1.default)(level);
    const colorizer = colors[_level];
    return `${chalk_1.default.grey(`[${new Date().getFullYear() +
        '-' +
        new Date().getMonth() +
        '-' +
        new Date().getDate() +
        ' ' +
        new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ':' +
        new Date().getSeconds()}]`)} ${_level === 'chat' ? '' : `[ ${label} ] `}${level} ${colorizer(message)} ${chalk_1.default.magentaBright(ms)}`;
});
const myCustomLevels = {
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
};
(0, winston_1.addColors)(myCustomLevels.colors);
class Logger {
    scope;
    logger;
    constructor(scope) {
        this.scope = scope;
        this.logger = (0, winston_1.createLogger)({
            levels: myCustomLevels.levels,
            transports: [
                new winston_1.transports.Console({
                    level: config_1.default.logger.dev ? 'debug' : config_1.default.logger.level,
                    format: combine(splat(), colorize(), timestamp(), ms(), myFormat)
                })
            ]
        });
    }
    log(message, ...args) {
        this.logger.info(message, ...args, { label: this.scope });
    }
    info(message, ...args) {
        this.logger.info(message, ...args, { label: this.scope });
    }
    warn(message, ...args) {
        this.logger.warn(message, ...args, { label: this.scope });
    }
    error(message, ...args) {
        this.logger.error(message, ...args, { label: this.scope });
    }
    debug(message, ...args) {
        this.logger.debug(message, ...args, { label: this.scope });
    }
    fatal(message, ...args) {
        this.logger.error(message, ...args, { label: this.scope });
        return process.exit(1);
    }
}
exports.default = Logger;
