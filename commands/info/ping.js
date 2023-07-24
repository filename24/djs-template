import { BaseCommand } from '../../structures/Command.js';
import Embed from '../../utils/Embed.js';
import { SlashCommandBuilder } from '@discordjs/builders';
export default new BaseCommand({
    name: 'ping',
    description: '핑을 측정합니다.',
    aliases: ['핑', '측정', 'vld']
}, async (client, message, args) => {
    let embed = new Embed(client, 'warn').setTitle('핑 측정중...');
    let m = await message.reply({
        embeds: [embed]
    });
    embed = new Embed(client, 'success').setTitle('PONG!').addFields([
        {
            name: '메세지 응답속도',
            value: `${Number(m.createdAt) - Number(message.createdAt)}ms`,
            inline: true
        },
        {
            name: 'API 반응속도',
            value: `${client.ws.ping}ms`,
            inline: true
        },
        {
            name: '업타임',
            value: `<t:${(Number(client.readyAt) / 1000) | 0}:R>`,
            inline: true
        }
    ]);
    m.edit({
        embeds: [embed]
    });
}, {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('핑을 측정합니다.')
        .toJSON(),
    options: {
        name: 'ping',
        isSlash: true
    },
    async execute(client, interaction) {
        let PingEmbed = new Embed(client, 'success')
            .setTitle('핑 측정')
            .addFields([
            {
                name: '메세지 응답속도',
                value: `${Number(Date.now()) - Number(interaction.createdAt)}ms`,
                inline: true
            },
            {
                name: 'API 반응속도',
                value: `${client.ws.ping}ms`,
                inline: true
            },
            {
                name: '업타임',
                value: `<t:${(Number(client.readyAt) / 1000) | 0}:R>`,
                inline: true
            }
        ]);
        interaction.reply({ embeds: [PingEmbed] });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbmZvL3BpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBRWpELE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQTtBQUNoQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUV6RCxlQUFlLElBQUksV0FBVyxDQUM1QjtJQUNFLElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLFdBQVc7SUFDeEIsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7Q0FDNUIsRUFDRCxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRTFELElBQUksQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQztRQUMxQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7S0FDaEIsQ0FBQyxDQUFBO0lBQ0YsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQy9EO1lBQ0UsSUFBSSxFQUFFLFVBQVU7WUFDaEIsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJO1lBQzdELE1BQU0sRUFBRSxJQUFJO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxVQUFVO1lBQ2hCLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJO1lBQzVCLE1BQU0sRUFBRSxJQUFJO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSztZQUNyRCxNQUFNLEVBQUUsSUFBSTtTQUNiO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNMLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNoQixDQUFDLENBQUE7QUFDSixDQUFDLEVBQ0Q7SUFDRSxJQUFJLEVBQUUsSUFBSSxtQkFBbUIsRUFBRTtTQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDO1NBQ2YsY0FBYyxDQUFDLFdBQVcsQ0FBQztTQUMzQixNQUFNLEVBQUU7SUFDWCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXO1FBQy9CLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7YUFDekMsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUNoQixTQUFTLENBQUM7WUFDVDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUk7Z0JBQ2hFLE1BQU0sRUFBRSxJQUFJO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUk7Z0JBQzVCLE1BQU0sRUFBRSxJQUFJO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO2dCQUNyRCxNQUFNLEVBQUUsSUFBSTthQUNiO1NBQ0YsQ0FBQyxDQUFBO1FBQ0osV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0NBQ0YsQ0FDRixDQUFBIn0=