const { EmbedBuilder, MessageAttachment } = require('discord.js')

module.exports = {
  name: 'messageDelete',
  once: 'on',
  async execute(message, client) {

    if (message.author) {
      if (message.author.bot) return;
      if (message.channel.name.startsWith('form') || message.channel.name.startsWith('ticket')) return;
    } else return;

    let file
    let deletedMSG = new EmbedBuilder()
      .setTitle(`🗑 | Mensagem excluída`)
      .setColor("#ad0213")
      .addFields(
        {
          name: `Autor da mensagem`,
          value: message.author.toString(),
          inline: false
        },
        {
          name: `Canal`,
          value: message.channel.toString(),
          inline: false
        },
      )
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `Enviada pelo ${message.author.username}` })

    if (message.content != '') {
      if (message.embeds != '') {
        deletedMSG.setImage(message.embeds[0].url)
      } else {
        deletedMSG.addFields({ name: `Mensagem`, value: `\`\`\`${message.content}\`\`\``, inline: false })
      }
    }
    if (message.attachments.size > 0) {
      let attachments = message.attachments.first()
      if (['png', 'jpg', 'gif'].includes(attachments.name.substr(-3, 3))) {
        deletedMSG.setImage(attachments.url)
      } else {
        file = new MessageAttachment(message.attachments.first().url)
      }
    }
    client.channels.cache.get('888454380569911346').send({ embeds: [deletedMSG], files: file == undefined ? [] : [file] })
  },
}
