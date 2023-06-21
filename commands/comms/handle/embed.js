const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.CommSucess = function (user, nick, steamid, tipo) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setDescription(
      `<a:right_savage:856211226300121098> ${user} O Player ${nick}, cuja Steamid é ${steamid} foi **mutado pelo ${tipo == 1 ? 'VOIP' : 'CHAT'}** com sucesso !`
    );
  return embed;
};

exports.Commlog = function (nick, steamid, tempo, reason, tipo, user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle(`**DISCORD**`)
    .addFields(
      { name: 'Nick Do Acusado', value: nick },
      { name: 'Steamid', value: steamid },
      {
        name: 'Tempo Do Mute',
        value: tempo == 0 ? '**PERMANENTE**' : tempo / 60 + ' ' + 'Minuto(s)',
      },
      { name: 'Motivo', value: reason }
    )
    .setFooter({ text: `Mutado Pelo ${user.username}` });
  return embed;
};

exports.CommError = function (user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${user}, houve um erro ao tentar mutar o player !`);
  return embed;
};
exports.UnMuteGuildLog = function (unmutted, user, steamid, motivoSolicitado, diretor, motivoCancelado) {
  const embed = new EmbedBuilder()
  if (!unmutted) {
    embed.setColor('#ff0000')
      .setTitle('Cancelado')
      .addFields(
        { name: 'Solicitado pelo', value: `${user}` },
        { name: 'Steamid solicitada', value: `${steamid}` },
        { name: 'Motivo do unmute', value: `${motivoSolicitado}` },
        { name: 'Ação feita pelo', value: `${diretor}` },
        { name: 'Motivo da reprovação', value: `${motivoCancelado}` },
      )
      .setFooter({ text: `Cancelado pelo ${diretor.username}` })
      .setTimestamp()
  } else {
    embed.setColor('#00ff00')
      .setTitle('Desmutado')
      .addFields(
        { name: 'Author', value: `${user}` },
        { name: 'Steamid Solicitada', value: `${steamid}` },
        { name: 'Motivo do Unmute', value: `${motivoSolicitado}` },
        { name: 'Ação feita pelo', value: `${diretor}` },
      )
      .setFooter({ text: `Desmutado pelo ${user}` })
      .setTimestamp()
  }


  return embed;
};
exports.MackNotTarget = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo !`);
  return embed;
};
exports.UnCommsLog = function (steamid, reason, interaction, tipo, id) {
  const embed = new EmbedBuilder()
    .setColor('#36393f')
    .setTitle(`**DESMUTE**`)
    .addFields({ name: 'Steamid', value: steamid }, { name: 'Motivo', value: reason }, { name: 'Tipo', value: tipo })
    .setFooter({ text: `Desmutado Pelo ${interaction.user.username}` });
  if (id) {
    embed.addFields({ name: 'ID', value: id.toString() })
  }

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('desmute_cancel')
      .setLabel('CANCELAR')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('desmute_approve')
      .setLabel('Desmutar')
      .setStyle(ButtonStyle.Danger),
  )
  return { embed, button };
};

exports.PlayerNotFound = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, não achei ninguem mutado com essa steamid !`);
  return embed;
};