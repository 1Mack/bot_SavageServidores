const { checkChannels } = require('../handle/checks/checkChannels')

module.exports = {
  name: 'messageCreate',
  once: 'on',
  async execute(message, client) {
    if (message.channelId == '795494831291891774') {
      checkChannels(message, client)
    }
  },
}
