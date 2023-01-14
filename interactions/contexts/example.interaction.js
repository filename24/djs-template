import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { ContextMenu } from '../../structures/Interaction.js';
export default new ContextMenu('contextMenu', new ContextMenuCommandBuilder()
    .setName('context')
    .setType(ApplicationCommandType.Message)
    .toJSON(), async (client, interaction) => { });
