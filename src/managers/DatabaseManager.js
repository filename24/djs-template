"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * @extends {BaseManager}
 */
class DatabaseManager extends BaseManager_1.default {
    logger;
    type;
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('DatabaseManager');
        this.type = client.config.database.type;
    }
    async load(schemaPath = path_1.default.join(__dirname, '../schemas')) {
        this.logger.debug('Using MongoDB...');
        mongoose_1.default.connect(this.client.config.database.url, this.client.config.database.options);
        this.client.db = mongoose_1.default.connection;
        this.loadSchemas(schemaPath);
    }
    loadSchemas(schemaPath) {
        this.logger.debug('Loading schemas...');
        const schemaFolder = fs_1.default.readdirSync(schemaPath);
        try {
            schemaFolder.forEach((schemaFile) => {
                try {
                    if (schemaFile.startsWith('example'))
                        return;
                    if (!schemaFile.endsWith('.ts'))
                        return this.logger.warn(`Not a TypeScript file ${schemaFile}. Skipping.`);
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { default: schema } = require(`../schemas/${schemaFile}`);
                    this.client.schemas.set(schema.modelName, schema);
                }
                catch (error) {
                    this.logger.error(`Error loading schema ${schemaFile}.\n` + error.stack);
                }
                finally {
                    this.logger.debug(`Succesfully loaded schemas. count: ${this.client.schemas.size}`);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
}
exports.default = DatabaseManager;
