module.exports = {
  name: 'ping',
  description : '핑을 측정합니다.',
  execute(message, args) {
    message.channel.send('Pong!');
  }
}