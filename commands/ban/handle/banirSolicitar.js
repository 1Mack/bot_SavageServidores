const { MackNotTarget } = require('./embed');
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.BanirSolicitar = async function (client, interaction, nick, steamid, servidor, motivo, userDiscord, anydesk, files, link) {

  if (steamid.startsWith('STEAM_0')) {
    steamid = steamid.replace('0', '1');
  }

  if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
    return interaction.reply({ embeds: [MackNotTarget(interaction)], ephemeral: true }).catch(() => { return 'O mack não é um alvo' })
  let attachments = []
  files.forEach(file => {
    if (file == null) return;
    if (typeof (file) == 'object') {


      attachments.push(new AttachmentBuilder(file.attachment))
    }
  })

  if (attachments.length == 0 && !link)
    return interaction.reply({ content: '**Você deve enviar ao menos 1 prova!!**', ephemeral: true }).catch(() => { return 'Você deve enviar ao menos uma prova' })


  let embeds = [new EmbedBuilder().setTitle('Nova sugestão de ban').setColor('36393f').setFields(
    { name: 'Nick', value: nick },
    { name: 'SteamID', value: steamid },
    { name: 'Servidor', value: servidor },
    { name: 'Discord', value: userDiscord ? `<@${userDiscord}>` : '\u200B' },
    { name: 'AnyDesk', value: anydesk ? anydesk : '\u200B' },
    { name: 'Motivo', value: motivo }
  ).setFooter({ text: `Solicitado pelo ${interaction.user.username} (${interaction.user.id})` })]
  if (link) {
    embeds[0].setDescription(`[Clique aqui para ver o vídeo](${link})`)
  }

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('cancelarSolicitado')
      .setLabel('CANCELAR')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('banidoSolicitado')
      .setLabel('JÁ FOI BANIDO')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('banirSolicitado')
      .setLabel('BANIR')
      .setStyle(ButtonStyle.Danger)

  )
  attachments.forEach(att => {
    embeds.push(new EmbedBuilder().setColor('36393f').setImage(typeof (att) == 'string' ? att : att.attachment))
  })
  interaction.guild.channels.cache.get('876903682279608351').send({ embeds: embeds, components: [button] })

  return interaction.reply({ content: '**Sugestão de banimento enviada com sucesso!**', ephemeral: true }).catch((err) => { return 'sucesso' })

};
