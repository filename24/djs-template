import { Collection, REST, Routes } from 'discord.js';
import Logger from '../utils/Logger.js';
import BaseManager from './BaseManager.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { BaseCommand, MessageCommand, SlashCommand } from '../structures/Command.js';
import { fileURLToPath } from 'url';
export default class CommandManager extends BaseManager {
    logger = new Logger('CommandManager');
    commands;
    constructor(client) {
        super(client);
        this.commands = client.commands;
    }
    async load(commandPath = path.join(dirname(fileURLToPath(import.meta.url)), '../commands')) {
        this.logger.debug('Loading commands...');
        const commandFolder = fs.readdirSync(commandPath);
        try {
            await Promise.all(commandFolder.map(async (folder) => {
                if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory())
                    return;
                try {
                    const commandFiles = fs.readdirSync(path.join(commandPath, folder));
                    await Promise.all(commandFiles.map(async (commandFile) => {
                        try {
                            const { default: command } = await import(`../commands/${folder}/${commandFile}`);
                            if (!command.data?.name ?? !command.name)
                                return this.logger.debug(`Command ${commandFile} has no name. Skipping.`);
                            this.commands.set(command.data.name ?? command.name, command);
                            this.logger.debug(`Loaded command ${command.data.name ?? command.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack);
                        }
                    }));
                }
                catch (error) {
                    this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack);
                }
            }));
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
        this.logger.info(`Succesfully loaded commands. count: ${this.commands.size}`);
        return this.commands;
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
    reload(commandPath = path.join(__dirname, '../commands')) {
        this.logger.debug('Reloading commands...');
        this.commands.clear();
        this.load(commandPath);
        this.logger.debug('Succesfully reloaded commands.');
        return { message: '[200] Succesfully reloaded commands.' };
    }
    static isSlash(command) {
        return command instanceof BaseCommand && command.slash
            ? true
            : command instanceof SlashCommand
                ? true
                : false;
    }
    static isMessageCommand(command) {
        return command instanceof MessageCommand
            ? true
            : command instanceof BaseCommand
                ? true
                : false;
    }
    async slashCommandSetup(guildID) {
        this.logger.scope = 'CommandManager: SlashSetup';
        const rest = new REST().setToken(this.client.token);
        const interactions = new Collection();
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
                .put(Routes.applicationCommands(this.client.application.id), {
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
                .put(Routes.applicationGuildCommands(this.client.application.id, guildID), {
                body: resolvedData.toJSON()
            })
                .then(() => this.logger.info(`Successfully registered server ${guildID} server commands.`));
            return resolvedData.toJSON();
        }
    }
}
