"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Command_1 = require("../structures/Command");
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
                            const command = 
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            require(`../commands/${folder}/${commandFile}`).default;
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
        let command = this.commands.get(commandName);
        command =
            command ??
                this.commands
                    .filter((c) => CommandManager.isMessageCommand(c) &&
                    c.data.aliases?.includes(commandName))
                    .first();
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
    static isSlash(command) {
        return command instanceof Command_1.BaseCommand && command.slash
            ? true
            : command instanceof Command_1.SlashCommand
                ? true
                : false;
    }
    static isMessageCommand(command) {
        return command instanceof Command_1.MessageCommand
            ? true
            : command instanceof Command_1.BaseCommand
                ? true
                : false;
    }
    async slashCommandSetup(guildID) {
        this.logger.scope = 'CommandManager: SlashSetup';
        const rest = new discord_js_1.REST().setToken(this.client.token);
        const interactions = new discord_js_1.Collection();
        this.client.interactions.forEach((command) => {
            if (command.type === 3 /* InteractionType.ContextMenu */) {
                interactions.set(command.data.name, command.data);
            }
        });
        this.client.commands.forEach((command) => {
            if (CommandManager.isSlash(command)) {
                interactions.set(command.data.name ?? command.slash?.data.name, command.slash ? command.slash?.data : command.data);
            }
        });
        if (!guildID) {
            this.logger.warn('guildID not gived switching global command...');
            this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);
            await rest
                .put(discord_js_1.Routes.applicationCommands(this.client.application.id), {
                body: interactions.toJSON()
            })
                .then(() => this.logger.info(`Successfully registered application global commands.`));
            return interactions.toJSON();
        }
        else {
            this.logger.info(`Slash Command requesting ${guildID}`);
            const commands = await this.client.application?.commands
                .fetch()
                .then((cmd) => cmd.map((cmd) => cmd.name));
            const resolvedData = interactions.filter((cmd) => commands ? !commands.includes(cmd.name) : true);
            await rest
                .put(discord_js_1.Routes.applicationGuildCommands(this.client.application.id, guildID), {
                body: resolvedData.toJSON()
            })
                .then(() => this.logger.info(`Successfully registered server ${guildID} server commands.`));
            return resolvedData.toJSON();
        }
    }
}
exports.default = CommandManager;
