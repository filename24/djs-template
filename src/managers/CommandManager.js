"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CommandManager extends BaseManager_1.default {
    logger = new Logger_1.default('CommandManager');
    commands;
    constructor(client) {
        super(client);
        this.commands = client.commands;
    }
    load(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Loading commands...');
        const commandFolder = fs_1.default.readdirSync(commandPath);
        try {
            commandFolder.forEach((folder) => {
                if (!fs_1.default.lstatSync(path_1.default.join(commandPath, folder)).isDirectory())
                    return;
                try {
                    const commandFiles = fs_1.default.readdirSync(path_1.default.join(commandPath, folder));
                    commandFiles.forEach((commandFile) => {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            const command = require(`../commands/${folder}/${commandFile}`).default;
                            if (!command.data.name ?? !command.name)
                                return this.logger.debug(`Command ${commandFile} has no name. Skipping.`);
                            this.commands.set(command.data.name ?? command.name, command);
                            this.logger.debug(`Loaded command ${command.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack);
                        }
                        finally {
                            this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`);
                            // eslint-disable-next-line no-unsafe-finally
                            return this.commands;
                        }
                    });
                }
                catch (error) {
                    this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
    get(commandName) {
        let command;
        if (this.client.commands.has(commandName))
            return (command = this.client.commands.get(commandName));
        this.client.commands.forEach((cmd) => {
            if (this.isSlash(cmd) && cmd.data.name === commandName)
                return (command = cmd);
            // @ts-ignore
            if (cmd.data.aliases.includes(commandName))
                return (command = cmd);
        });
        return command;
    }
    reload(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Reloading commands...');
        this.commands.clear();
        try {
            this.load(commandPath);
        }
        finally {
            this.logger.debug('Succesfully reloaded commands.');
            // eslint-disable-next-line no-unsafe-finally
            return { message: '[200] Succesfully reloaded commands.' };
        }
    }
    isSlash(command) {
        //return command?.options.slash ?? false
        return command?.slash
            ? true
            : command?.options?.isSlash
                ? true
                : false;
    }
    async slashCommandSetup(guildID) {
        this.logger.scope = 'CommandManager: SlashSetup';
        const slashCommands = [];
        this.client.commands.forEach((command) => {
            if (this.isSlash(command)) {
                slashCommands.push(command.slash ? command.slash?.data.toJSON() : command.data.toJSON());
            }
        });
        if (!guildID) {
            this.logger.warn('guildID not gived switching global command...');
            this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);
            for (const command of slashCommands) {
                const commands = await this.client.application?.commands.fetch();
                const cmd = commands?.find((cmd) => cmd.name === command.name);
                if (!cmd) {
                    await this.client.application?.commands
                        .create(command)
                        .then((guilds) => this.logger.info(`Succesfully created command ${command.name} at ${guilds.name}(${guilds.id}) guild`));
                }
            }
        }
        else {
            this.logger.info(`Slash Command requesting ${guildID}`);
            const guild = this.client.guilds.cache.get(guildID);
            for (const command of slashCommands) {
                const commands = await guild?.commands.fetch();
                const cmd = commands?.find((cmd) => cmd.name === command.name);
                if (!cmd) {
                    await guild?.commands
                        .create(command)
                        .then((guild) => this.logger.info(`Succesfully created command ${command.name} at ${guild.name} guild`));
                }
            }
            return slashCommands;
        }
    }
}
exports.default = CommandManager;
