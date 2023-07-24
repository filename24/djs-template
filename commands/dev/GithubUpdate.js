import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Embed from '../../utils/Embed.js';
import fetch from 'node-fetch';
import { execSync } from 'child_process';
import { MessageCommand } from '../../structures/Command.js';
export default new MessageCommand({
    name: 'update',
    description: '최신 업데이트 내용을 확인합니다.',
    aliases: ['업데이트', 'djqepdlxm', '촏차', 'check']
}, async (client, message, args) => {
    // @ts-ignore
    if (!client.dokdo.owners.includes(message.author.id))
        return message.reply(`해당 명령어는 ${client.user?.username}의 주인이 사용할 수 있는 명령어입니다.`);
    let LoadingEmbed = new Embed(client, 'warn')
        .setTitle('잠시만 기다려주십시요')
        .setDescription('최신 업데이트 내용을 불러오는 중입니다...');
    const msg = await message.reply({ embeds: [LoadingEmbed] });
    if (client.config.repository?.includes('Your github url') ||
        !client.config.repository) {
        LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: config 파일에 `repository` 값이 없습니다.')
            .setType('error');
        await msg.edit({ embeds: [LoadingEmbed] });
    }
    let repo = client.config.repository?.replaceAll('https://github.com/', '');
    const res = await fetch(`https://api.github.com/repos/${repo}/commits`, {
        headers: {
            Authorization: client.config.githubToken
                ? `token ${client.config.githubToken}`
                : ''
        }
    });
    if (!res.ok && res.status === 400) {
        LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: `config`파일에 있는 `repository` 에 있는 주소를 찾을수 없습니다.')
            .setType('error');
        return msg.edit({ embeds: [LoadingEmbed] });
    }
    let json = (await res.json());
    if (json[0].sha.trim().substring(0, 7) === client.BUILD_NUMBER) {
        let SuccessEmbed = new Embed(client, 'success')
            .setTitle('확인 완료!')
            .setDescription('현재 최신 버전을 이용중입니다!')
            .addFields([
            {
                name: '현재 버전',
                value: `v${client.VERSION}`,
                inline: true
            },
            {
                name: '현재 빌드 번호',
                value: `${client.BUILD_NUMBER}`,
                inline: true
            }
        ]);
        return msg.edit({ embeds: [SuccessEmbed] });
    }
    for (let count = 0; count < json.length; count++) {
        const commit = json[count];
        if (commit.sha.trim().substring(0, 7) === client.BUILD_NUMBER) {
            let NewUpdateEmbed = new Embed(client, 'success')
                .setTitle('최신 업데이트가 있습니다!')
                .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                .addFields([
                {
                    name: '현재 버전',
                    value: `v${client.VERSION}`,
                    inline: true
                },
                {
                    name: '현재 빌드 번호',
                    value: `${client.BUILD_NUMBER}`,
                    inline: true
                },
                {
                    name: '최신 빌드 번호',
                    value: `${json[0].sha.trim().substring(0, 6)}`,
                    inline: true
                }
            ]);
            let buttonData = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('업데이트 하기')
                .setEmoji('✅')
                .setCustomId('update.run');
            let components = new ActionRowBuilder().addComponents([buttonData]);
            let collector = msg.channel.createMessageComponentCollector({
                time: 10 * 1000
            });
            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'update.run') {
                    collector.stop();
                    try {
                        execSync(`git pull https://username:${client.config.githubToken}@github.com/${repo}`);
                    }
                    catch (e) {
                        execSync('git fetch --all');
                        execSync('git reset --hard HEAD');
                        execSync('git merge @{u}');
                    }
                    await interaction.reply('업데이트가 완료되었습니다!');
                }
                else if (interaction.user.id !== message.author.id) {
                    interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`);
                }
            });
            msg.edit({
                embeds: [NewUpdateEmbed],
                components: [components]
            });
            break;
        }
        else if (count > 0) {
            let BranchErrorEmbed = new Embed(client, 'error')
                .setTitle('뭔가 잘못된거 같아요...')
                .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?');
            msg.edit({ embeds: [BranchErrorEmbed], components: [] });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2l0aHViVXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2Rldi9HaXRodWJVcGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsV0FBVyxFQUVaLE1BQU0sWUFBWSxDQUFBO0FBQ25CLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQTtBQUNoQyxPQUFPLEtBQUssTUFBTSxZQUFZLENBQUE7QUFDOUIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUN4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFHcEQsZUFBZSxJQUFJLGNBQWMsQ0FDL0I7SUFDRSxJQUFJLEVBQUUsUUFBUTtJQUNkLFdBQVcsRUFBRSxvQkFBb0I7SUFDakMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO0NBQzlDLEVBQ0QsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDOUIsYUFBYTtJQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbEQsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUNsQixXQUFXLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSx3QkFBd0IsQ0FDekQsQ0FBQTtJQUVILElBQUksWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDekMsUUFBUSxDQUFDLGFBQWEsQ0FBQztTQUN2QixjQUFjLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUU3QyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxD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