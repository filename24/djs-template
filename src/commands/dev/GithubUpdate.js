const Discord = require('discord.js')
const Embed = require('../../utils/Embed')
const fetch = require('node-fetch')
const child = require('child_process')
const { repository } = require('../../../package.json')

module.exports = {
  name: 'update',
  description : '최신 업데이트 내용을 확인합니다.',
  aliases: ['업데이트', 'djqepdlxm', '촏차', 'check'],
  isSlash: false,
  /**
   * @param {import('../../structures/BotClient')} client 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   */
  async execute(client, message, args) {
    if(!client.dokdo.owners.includes(message.author.id))
      return message.reply(`해당 명령어는 ${client.user.username}의 주인이 사용할 수 있는 명령어입니다.`)

    let LoadingEmbed = new Embed(client, 'warn')
      .setTitle('잠시만 기다려주십시요')
      .setDescription('최신 업데이트 내용을 불러오는 중입니다...')

    let msg = await message.reply({embeds: [LoadingEmbed]})
    if(repository?.includes('Your github url') || !repository) {
      LoadingEmbed.setTitle('이런...')
        .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: package.json에 `repository` 값이 없습니다.')
        .setType('error')
      
      await msg.edit({embeds: [LoadingEmbed]})
    }

    let repo = repository.replaceAll('https://github.com/', '')
    if(client.config.githubToken || !client.config.githubToken === '') {
      fetch(`https://api.github.com/repos/${repo}/commits`, {
        headers: {
          'Authorization': `token ${client.config.githubToken}`
        }
      }).then((res) => {
        if(!res.ok && res.status === 404) {
          LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: `package.json`에 있는 `repository` 에 있는 주소를 찾을수 없습니다.')
            .setType('error')

          msg.edit({embeds: [LoadingEmbed]})
        } else {
          res.json().then((json) => {
            if(json[0].sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
              let SuccessEmbed = new Embed(client, 'success')
                .setTitle('확인 완료!')
                .setDescription('현재 최신 버전을 이용중입니다!')
                .addField('현재 버전', `v${client.VERSION}`, true)
                .addField('현재 빌드 번호', `${client.BUILD_NUMBER}`, true)

              return msg.edit({embeds: [SuccessEmbed]})
            } else {
              let count = 0
              json.forEach(commit => {
            
                count++
                if(commit.sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                  let NewUpdateEmbed = new Embed(client, 'success')
                    .setTitle('최신 업데이트가 있습니다!')
                    .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                    .addField('현재 버전', `v${client.VERSION}`, true)
                    .addField('현재 빌드 번호', `${client.BUILD_NUMBER}`, true)
                    .addField('최신 빌드 번호', `${json[0].sha.trim().substring(0, 6)}`, true)

                    let buttonData = new Discord.MessageButton()
                    .setStyle('SUCCESS')
                    .setLabel('업데이트 하기')
                    .setEmoji('✅')
                    .setCustomId('update.run')

                  let components = new Discord.MessageActionRow()
                    .addComponents(buttonData)

                  let collector = msg.channel.createMessageComponentCollector({time: 10 * 1000})

                  collector.on('collect', async (interaction) => {
                    if(interaction.customId === 'update.run') {
                      collector.stop()

                      child.execSync(`git pull https://username:${client.config.githubToken}@github.com/${repo}`)
                      await interaction.reply('업데이트가 완료되었습니다!')
                    } else if (interaction.user.id !== message.author.id) {
                      interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`)
                    }
                  })
                  msg.edit({embeds: [NewUpdateEmbed], components: [components]})
                } /*else {
                  let BranchErrorEmbed = new Embed(client, 'error')
                    .setTitle('뭔가 잘못된거 같아요...')
                    .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?')

                  msg.edit({embeds: [BranchErrorEmbed]})
                }*/
              })
            }
          })
        }
      })
    } else {
      fetch(`https://api.github.com/repos/${repo}/commits`).then((res) => {
        if(!res.ok && res.status === 404) {
          LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: 찾을수 없거나 비공개되어 있습니다.')
            .setType('error')

          msg.edit({embeds: [LoadingEmbed]})
        } else {
          res.json().then((json) => {
            if(json[0].sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
              let SuccessEmbed = new Embed(client, 'success')
                .setTitle('확인 완료!')
                .setDescription('현재 최신 버전을 이용중입니다!')
                .addField('현재 버전', `v${client.VERSION}`, true)
                .addField('현재 빌드 번호', `[${client.BUILD_NUMBER}](${repository}/commit/${client.BUILD_NUMBER})`, true)

              return msg.edit({embeds: [SuccessEmbed]})
            } else {
              let count = 0
              json.forEach(commit => {
            
                count++
                if(commit.sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                  let NewUpdateEmbed = new Embed(client, 'success')
                    .setTitle('최신 업데이트가 있습니다!')
                    .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                    .addField('현재 버전', `v${client.VERSION}`, true)
                    .addField('현재 빌드 번호', `[${client.BUILD_NUMBER}](${repository}/commit/${client.BUILD_NUMBER})`, true)
                    .addField('최신 빌드 번호', `[${json[0].sha.trim().substring(0, 6)}](${repository}/commit/${json[0].sha})`, true)

                  let buttonData = new Discord.MessageButton()
                    .setStyle('SUCCESS')
                    .setLabel('업데이트 하기')
                    .setEmoji('✅')
                    .setCustomId('update.run')

                  let components = new Discord.MessageActionRow()
                    .addComponents(buttonData)
                  let collector = msg.channel.createMessageComponentCollector({time: 10 * 1000})

                  collector.on('collect', async (interaction) => {
                    if(interaction.customId === 'update.run') {
                      collector.stop()

                      child.execSync(`git pull https://username:${client.config.githubToken}@github.com/${repo}`)
                      await interaction.reply('업데이트가 완료되었습니다!')
                    } else if (interaction.user.id !== message.author.id) {
                      interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`)
                    }
                  })
                  return msg.edit({embeds: [NewUpdateEmbed], components: [components]})
                } /*else {
                  let BranchErrorEmbed = new Embed(client, 'error')
                    .setTitle('뭔가 잘못된거 같아요...')
                    .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?')
                  msg.edit({embeds: [BranchErrorEmbed]})
                }*/
              })
            }
          })
        }
      })
    }
  },
}