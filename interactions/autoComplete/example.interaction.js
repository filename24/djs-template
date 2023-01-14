import { AutoComplete } from '../../structures/Interaction.js';
export default new AutoComplete('autoComplete', async (client, interaction) => {
    interaction.respond([
        { name: 'data', value: 'data' },
        { name: 'for', value: 'for' },
        { name: 'autoComplete', value: 'autoComplete' }
    ]);
});
