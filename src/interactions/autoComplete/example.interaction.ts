import { AutoComplete } from '@structures/Interaction'

export default new AutoComplete('autoComplete', async (client, interaction) => {
  interaction.respond([
    { name: 'data', value: 'data' },
    { name: 'for', value: 'for' },
    { name: 'autoComplete', value: 'autoComplete' }
  ])
})
