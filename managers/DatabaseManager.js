"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const client_1 = require("@prisma/client");
/**
 * @extends {BaseManager}
 */
class DatabaseManager extends BaseManager_1.default {
    logger;
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('DatabaseManager');
    }
    async load() {
        this.logger.debug('Using Prisma...');
        this.client.db = new client_1.PrismaClient();
        this.client.db.$connect().then(() => {
            this.logger.info('Connected to Prisma');
        });
    }
}
exports.default = DatabaseManager;
