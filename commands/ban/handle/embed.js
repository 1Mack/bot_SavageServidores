const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.BanSucess = function (user, nick, steamid) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setDescription(
      `<a:right_savage:856211226300121098> ${user} O Player ${nick}, cuja Steamid é ${steamid} foi **banido** com sucesso !`
    );
  return embed;
};

exports.Banlog = function (nick, steamid, tempo, reason, user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle(`**DISCORD**`)
    .addFields(
      { name: 'Nick Do Acusado', value: nick },
      { name: 'Steamid', value: steamid },
      {
        name: 'Tempo Do Banimento',
        value: tempo == 0 ? '**PERMANENTE**' : tempo + ' ' + 'Minuto(s)',
      },
      { name: 'Motivo', value: reason }
    )
    .setFooter({ text: `Banido Pelo ${user.username}` });
  return embed;
};

exports.BanError = function (user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${user}, houve um erro ao tentar banir o player !`);
  return embed;
};
exports.UnbanGuildLog = function (unbanned, user, steamid, motivoSolicitado, diretor, motivoCancelado) {
  const embed = new EmbedBuilder()
  if (!unbanned) {
    embed.setColor('#ff0000')
      .setTitle('Cancelado')
      .addFields(
        { name: 'Solicitado pelo', value: `${user}` },
        { name: 'Steamid solicitada', value: `${steamid}` },
        { name: 'Motivo do unban', value: `${motivoSolicitado}` },
        { name: 'Ação feita pelo', value: `${diretor}` },
        { name: 'Motivo da reprovação', value: `${motivoCancelado}` },
      )
      .setFooter({ text: `Cancelado pelo ${diretor.username}` })
      .setTimestamp()
  } else {
    embed.setColor('#00ff00')
      .setTitle('Desbanido')
      .addFields(
        { name: 'Author', value: `${user}` },
        { name: 'Steamid Solicitada', value: `${steamid}` },
        { name: 'Motivo do Unban', value: `${motivoSolicitado}` },
        { name: 'Ação feita pelo', value: `${diretor}` },
      )
      .setFooter({ text: `Desbanido pelo ${user}` })
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
exports.DesbanLog = function (steamid, reason, interaction, id) {
  const embed = new EmbedBuilder()
    .setColor('#36393f')
    .setTitle(`**DESBAN**`)
    .addFields({ name: 'Steamid', value: steamid }, { name: 'Motivo', value: reason })
    .setFooter({ text: `Desbanido Pelo ${interaction.user.username}` });

  if (id) {
    embed.addFields({ name: 'ID', value: id.toString() })
  }

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('desban_cancel')
      .setLabel('CANCELAR')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('desban_approve')
      .setLabel('Desbanir')
      .setStyle(ButtonStyle.Danger),
  )
  return { embed, button };
};

exports.PlayerNotFound = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, não achei ninguem banido com essa steamid !`);
  return embed;
};