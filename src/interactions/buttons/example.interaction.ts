import { Button } from '@structures/Interaction'

export default new Button('button', async (client, interaction) => {
  interaction.reply('You clicked the button!')
})
