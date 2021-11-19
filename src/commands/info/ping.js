module.exports = {
  name: 'ping',
  description : '핑을 측정합니다.',
  aliases: ['핑', '측정', 'vld'],
  execute(client, message, args) {
    message.channel.send('Pong!');
  }
}