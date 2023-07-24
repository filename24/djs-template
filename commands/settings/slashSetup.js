import { ActionRowBuilder, ButtonBuilder, ButtonStyle, RESTJSONErrorCodes } from 'discord.js';
import CommandManager from '../../managers/CommandManager.js';
import Embed from '../../utils/Embed.js';
import ErrorManager from '../../managers/ErrorManager.js';
import { BaseCommand } from '../../structures/Command.js';
export default new BaseCommand({
    name: 'slashSetup',
    aliases: ['slash', 'setup', 'tpxld', '세팅']
}, async (client, message, args) => {
    let commandManager = new CommandManager(client);
    let errorManager = new ErrorManager(client);
    let row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('동의합니다.')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✅')
    ]);
    let embed = new Embed(client, 'warn')
        .setTitle('잠시만요!')
        .setDescription(`Slash Command를 사용하려면 봇 초대할 떄 \`applications.commands\` 스코프를 사용하지 않았을 경우 해당기능을 이용할 수 없습니다. 만약 \`applications.commands\` 스코프를 안 할 경우 [여기를](https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&scope=applications.commands) 클릭하여 허용해 주시기 바랍니다.`);
    let m = await message.channel.send({ embeds: [embed], components: [row] });
    const collector = m.createMessageComponentCollector({ time: 5000 });
    collector.on('collect', async (i) => {
        if (i.user.id === message.author.id) {
            let loading = new Embed(client, 'info')
                .setDescription('Slash Command 로딩중...')
                .setAuthor({
                name: '잠시만 기다려주십시요...',
                iconURL: 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1'
            });
            await i.update({ embeds: [loading], components: [] });
            commandManager
                .slashCommandSetup(message.guild?.id)
                .then((data) => {
                m.delete();
                message.channel.send({
                    embeds: [
                        new Embed(client, 'success')
                            .setTitle('로딩완료!')
                            .setDescription(`${data?.length}개의 (/) 명령어를 생성했어요!`)
                    ]
                });
            })
                .catch((error) => {
                m.delete();
                if (error.code === RESTJSONErrorCodes.MissingAccess) {
                    message.channel.send({
                        embeds: [
                            new Embed(client, 'error')
                                .setTitle('Error!')
                                .setDescription('제 봇 권한이 부족합니다...\n> 필요한 권한\n`applications.commands`스코프')
                        ]
                    });
                }
                else {
                    errorManager.report(error, { executer: message, isSend: true });
                }
            });
        }
        else {
            i.reply({
                content: `명령어 요청한 **${message.author.username}**만 사용할수 있어요.`,
                ephemeral: true
            });
        }
    });
    collector.on('end', (collected) => {
        if (collected.size == 1)
            return;
        m.edit({
            embeds: [embed],
            components: [
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId('accept')
                        .setLabel('시간 초과. 다시 시도해주세요...')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⛔')
                        .setDisabled(true)
                ])
            ]
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhc2hTZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXR0aW5ncy9zbGFzaFNldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLFdBQVcsRUFFWCxrQkFBa0IsRUFDbkIsTUFBTSxZQUFZLENBQUE7QUFDbkIsT0FBTyxjQUFjLE1BQU0sMEJBQTBCLENBQUE7QUFDckQsT0FBTyxLQUFLLE1BQU0sY0FBYyxDQUFBO0FBQ2hDLE9BQU8sWUFBWSxNQUFNLHdCQUF3QixDQUFBO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUVqRCxlQUFlLElBQUksV0FBVyxDQUM1QjtJQUNFLElBQUksRUFBRSxZQUFZO0lBQ2xCLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQztDQUMzQyxFQUNELEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQzlCLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9DLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTNDLElBQUksR0FBRyxHQUNMLElBQUksZ0JBQWdCLEVBQW9DLENBQUMsYUFBYSxDQUFDO1FBQ3JFLElBQUksYUFBYSxFQUFFO2FBQ2hCLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDckIsUUFBUSxDQUFDLFFBQVEsQ0FBQzthQUNsQixRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQzthQUM3QixRQUFRLENBQUMsR0FBRyxDQUFDO0tBQ2pCLENBQUMsQ0FBQTtJQUNKLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDbEMsUUFBUSxDQUFDLE9BQU8sQ0FB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