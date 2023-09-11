const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
moment.locale('en-gb')
exports.MackNotTarget = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo !`);
  return embed;
};

exports.SteamidNotFound = function (interaction, steamid) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, nao achei ninguem a steamid **${steamid}**!`);
  return embed;
};

exports.PlayerDiscordRoleNotFound = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, não achei o discord desse player, você terá que remover o cargo dele do discord manualmente !`
    );
  return embed;
};

exports.DemotedLog = function (fetchUser, steamid, extra, interaction, servidor) {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(fetchUser.username || 'Indefinido')
    .addFields(
      {
        name: 'discord',
        value: `${fetchUser || 'Indefinido'}`,
      },
      { name: 'Steamid', value: steamid },
      { name: 'Servidor', value: servidor },
      { name: 'Observações', value: extra }
    )
    .setFooter({ text: `Demotado Pelo ${interaction.user.username}` });
  return embed;
};
exports.DemotedSendMSG = function (fetchUser, steamid, servidor, extra) {
  const embed = new EmbedBuilder()
    .setColor('FF0000')
    .setTitle(`Olá ${fetchUser.username || 'Indefinido'}`)
    .setDescription(
      `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
    )
    .addFields(
      { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
      { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
      { name: '**Motivo**', value: `\`\`\`${extra}\`\`\`` }
    );
  return embed;
};

exports.DemotedAskConfirm = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ffff00')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user} Tem certeza que quer fazer isso ?`
    );
  const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('sim')
        .setLabel('SIM')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('nao')
        .setLabel('NÃO')
        .setStyle(ButtonStyle.Primary)
    )
  return { embed, button };
};

exports.DemotedInfo = function (rows, user) {

  /*  rows = rows.filter((value, index, self) =>
     index === self.findIndex((t) => (
       t.serverFind ?
         t.serverFind.serverNumber === value.serverFind.serverNumber && t.cargo === value.cargo :
         t.row.server_id === value.row.server_id && t.cargo === value.cargo
     ))
   ) */

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setDescription(`Você quer demotar o player com a steamid **${user}** em quais servidores?
        
        Clique na lista abaixo para escolher!`)

  const selectMenu = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('demoted_selectMenu')
        .setPlaceholder('Escolha quais cargos demotar (Você pode selecionar mais de um)')
        .setMaxValues(rows.length)
        .setMinValues(1)
        .addOptions(
          rows.map((m, i) => {

            let getFullDate = moment(m.row.enddate).local().subtract(3, 'hours')

            return {
              label: `${m.serverFind ? m.serverFind.visualName.toUpperCase() : 'Desconhecido'}    | ${m.cargo} (${m.cargo.endsWith('p') ? getFullDate.year() >= 2033 ? 'PERMANENTE' : getFullDate.format('DD-MM-YYYY HH:mm:ss') : 'STAFF'})`,
              value: `${m.serverFind ? m.serverFind.serverNumber : m.row.server_id}-${m.cargo}`
            }
          })
        )

    )
  return { embed, selectMenu };
};