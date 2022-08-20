"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
class InteractionManager extends BaseManager_1.default {
    logger = new Logger_1.default('InteractionManager');
    interactions;
    constructor(client) {
        super(client);
        this.interactions = client.interactions;
    }
    async load(interactionPath = (0, path_1.join)(__dirname, '../interactions')) {
        this.logger.debug('Loading interactions...');
        const interactionFolder = (0, fs_1.readdirSync)(interactionPath);
        try {
            interactionFolder.forEach((folder) => {
                if (!(0, fs_1.lstatSync)((0, path_1.join)(interactionPath, folder)).isDirectory())
                    return;
                try {
                    const interactionFiles = (0, fs_1.readdirSync)((0, path_1.join)(interactionPath, folder));
                    interactionFiles.forEach((interactionFile) => {
                        try {
                            const interaction = 
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            require(`../interactions/${folder}/${interactionFile}`).default;
                            if (!interaction.name)
                                return this.logger.debug(`interaction ${interactionFile} has no name. Skipping.`);
                            this.interactions.set(interaction.name, interaction);
                            this.logger.debug(`Loaded interaction ${interaction.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading interaction '${interactionFile}'.\n` +
                                error.stack);
                        }
                        finally {
                            this.logger.debug(`Succesfully loaded interactions. count: ${this.interactions.size}`);
                            // eslint-disable-next-line no-unsafe-finally
                            return this.interactions;
                        }
                    });
                }
                catch (error) {
                    this.logger.error(`Error loading interaction folder '${folder}'.\n` + error.stack);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
    get(name) {
        return this.interactions.get(name);
    }
}
exports.default = InteractionManager;
