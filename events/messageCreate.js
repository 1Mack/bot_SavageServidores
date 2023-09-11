const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { guildsInfo } = require("../configs/config_geral");

module.exports = {
  name: 'messageCreate',
  once: 'on',
  async execute(message, client) {
    const guild = await client.guilds.cache.get(guildsInfo.log)
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
      if (message.channel.parentId === '1097614787304771735' && !message.author.bot) {
        try {
          let findUser = await client.users.fetch(message.channel.topic)
          await findUser.send({ content: message.content, files: message.attachments.map(m => m.attachment) })
        } catch (err) {
          console.log(err)
          message.channel.send('***Mensagem não pode ser enviada!***')
        }
      } else if (['@everyone', '@here'].some(v => message.content.includes(v)) && !(message.member.roles.cache.has('780582159731130378') || message.member.roles.cache.has('603318536798077030'))) {
        message.delete()

        try {
          let embed = new EmbedBuilder().setDescription(`\`\`\`${message.content}\`\`\``).setTitle('***Você não pode enviar esta mensagem mensagem***')

          message.author.send({ embeds: [embed] })
        } catch (error) { }
        let embed = new EmbedBuilder().setDescription(`${message.author}` + '\n\n\n\n' + message.content).setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }).setFooter({ text: message.author.id })
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('kick')
            .setLabel('KICK')
            .setStyle(ButtonStyle.Danger),
        )
        message.guild.channels.cache.get('814295769699713047').send({ embeds: [embed], components: [buttons] })

      }
    }
  },
};
