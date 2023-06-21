const { ChannelType } = require("discord.js");

module.exports = {
  name: 'messageCreate',
  once: 'on',
  async execute(message, client) {
    const guild = await client.guilds.cache.get('792575394271592458')
    if (!message.guild || message.guild.type === ChannelType.DM) {
      if (message.author.bot) return;
      let userChannel = await guild.channels.cache.find(channel => channel.topic === message.author.id)

      if (!userChannel) {
        await guild.channels.create({
          name: `${message.author.username}`,
          type: ChannelType.GuildText,
          topic: message.author.id,
          parent: '1097614787304771735',
        }).then(channel => userChannel = channel)
      }
      let msg = await userChannel.send({ content: message.content, files: message.attachments.map(m => m.attachment) })
      
      let findUser = await client.users.fetch('323281577956081665')
      
      findUser.send(`***Nova Mensagem → https://discord.com/channels/792575394271592458/${userChannel.id}/${msg.id}***`)
    } else {
      if (message.channel.parentId !== '1097614787304771735' || message.author.bot) return;

      try {
        let findUser = await client.users.fetch(message.channel.topic)
        await findUser.send({ content: message.content, files: message.attachments.map(m => m.attachment) })
      } catch (err) {
        console.log(err)
        message.channel.send('***Mensagem não pode ser enviada!***')
      }
    }
  },
};
