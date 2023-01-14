import { Button } from '../../structures/Interaction.js';
export default new Button(['button', 'fake'], async (client, interaction) => {
    interaction.reply('You clicked the button!');
});
