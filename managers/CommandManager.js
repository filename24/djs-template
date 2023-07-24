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
        this.logger.getSubLogger({ name: 'SlashSetup' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFuYWdlcnMvQ29tbWFuZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNQLE1BQU0sWUFBWSxDQUFBO0FBR25CLE9BQU8sTUFBTSxNQUFNLGVBQWUsQ0FBQTtBQUNsQyxPQUFPLFdBQVcsTUFBTSxrQkFBa0IsQ0FBQTtBQUMxQyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFDbkIsT0FBTyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFFcEMsT0FBTyxFQUNMLFdBQVcsRUFDWCxjQUFjLEVBQ2QsWUFBWSxFQUNiLE1BQU0sd0JBQXdCLENBQUE7QUFFL0IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUVuQyxNQUFNLENBQUMsT0FBTyxPQUFPLGNBQWUsU0FBUSxXQUFXO0lBQzdDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3JDLFFBQVEsQ0FBdUI7SUFFdkMsWUFBbUIsTUFBaUI7UUFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRWIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQ2pDLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUNmLGNBQXNCLElBQUksQ0FBQyxJQUFJLENBQzdCLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUN2QyxhQUFhLENBQ2Q7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBRXhDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFakQsSUFBSTtZQUNGLE1B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