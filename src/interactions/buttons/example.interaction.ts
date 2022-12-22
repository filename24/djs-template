import { Button } from '@structures/Interaction'

export default new Button(['button', 'fake'], async (client, interaction) => {
  interaction.reply('You clicked the button!')
})
