const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Embed = require('../../utils/Embed')
const ErrorManager = require('../../managers/ErrorManager')

module.exports = {
	name: 'slashSetup',
	aliases: ['slash', 'setup', 'tpxld', '세팅'],
	description: 'Slash Command 세팅합니다.',
  /**
   * 
   * @param {import('../../structures/BotClient')} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   */
	async execute(client, message, args) {
    
    let errorManager = new ErrorManager(client)
		let row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId('accept')
				.setLabel('동의합니다.')
				.setStyle('SUCCESS')
				.setEmoji('✅')
		);
		let embed = new Embed(client, 'warn')
			.setTitle('잠시만요!')
			.setDescription(
				`Slash Command를 사용하려면 봇 초대할 떄 \`applications.commands\` 스코프를 사용하지 않았을 경우 해당기능을 이용할 수 없습니다. 만약 \`applications.commands\` 스코프를 안 할 경우 [여기를](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&scope=applications.commands) 클릭하여 허용해 주시기 바랍니다.`
			);

		let m = await message.channel.send({ embeds: [embed], components: [row] });

		const collector = m.createMessageComponentCollector({ time: 5000 });

		collector.on('collect', async (i) => {
			if (i.user.id === message.author.id) {
				let count = 0;
				let loading = new Embed(client, 'info')
					.setDescription('Slash Command 로딩중...')
					.setAuthor(
						'잠시만 기다려주십시요...',
						'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1'
					);
				await i.update({ embeds: [loading], components: [] });

				let slashCommands = []
				for (let command of client.commands) {
					console.log(command)
        	slashCommands.push(command[1].isSlash ? command[1].data.toJSON() : command[1].slash?.data.toJSON());
				}

        try {
          const rest = new REST({ version: '9' }).setToken(client.token)

          await rest.put(
            Routes.applicationGuildCommands(client.user.id, message.guild.id),
            { body: slashCommands },
          );
      
          m.delete();
						message.channel.send({
							embeds: [
								new Embed(client, 'success')
									.setTitle('로딩완료!')
									.setDescription(`로딩된 (/)명령어 : ${count}개`),
							],
						});
        } catch (error) {
          errorManager.report(error, message, false)
						m.delete();
						message.channel.send({
							embeds: [
								new Embed(client, 'error')
									.setTitle('Error!')
									.setDescription(
										'제 봇 권한이 부족합니다...\n> 필요한 권한\n`applications.commands`스코프'
									),
							],
						});
        }

			} else {
				i.reply({
					content: `명령어 요청한 **${message.author.username}**만 사용할수 있어요.`,
					ephemeral: true,
				});
			}
		});
		collector.on('end', (collected) => {
			if(collected.size == 1)
				return
			m.edit({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId('accept')
				.setLabel('시간 초과. 다시 시도해주세요...')
				.setStyle('SECONDARY')
				.setEmoji('⛔')
				.setDisabled(true)
		)] });
		});
	},
};