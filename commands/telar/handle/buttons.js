const { ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const { serversInfos } = require('../../../configs/config_geral')
exports.TelandoButtons = function () {

  const confirm = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('sim')
      .setLabel('SIM')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('nao')
      .setLabel('NãO')
      .setStyle(ButtonStyle.Primary)
  )

  const banOrCancel = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('telando_cancelar')
      .setLabel('ENCERRAR SALA')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('telando_banir')
      .setLabel('BANIR')
      .setStyle(ButtonStyle.Danger)

  )

  const sendToTelados = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('send_telados')
      .setLabel('Enviar pro TELADOS')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('not_telados')
      .setLabel('Não enviar pro TELADOS')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('CANCELAR')
      .setStyle(ButtonStyle.Danger)
  )

  const banFields = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('nick')
      .setLabel('NICK')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('steamid')
      .setLabel('LINK PERFIL')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('servidor')
      .setLabel('SERVIDOR')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('anydesk')
      .setLabel('ANYDESK')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('observacoes')
      .setLabel('OBSERVAÇÕES')
      .setStyle(ButtonStyle.Primary)
  )
  const evidences = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('file')
      .setLabel('IMAGEM/VÍDEO')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('link')
      .setLabel('LINK')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('send')
      .setLabel('ENVIAR')
      .setDisabled(true)
      .setStyle(ButtonStyle.Danger)
  )
  const ServersMenu = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('serversMenu')
        .setPlaceholder('Selecione o servidor')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(serversInfos.map((m, i) => {
          return {
            label: m.visualName.toString(),
            value: m.name,
          }
        }))
    )

  return { confirm, banOrCancel, sendToTelados, banFields, evidences, ServersMenu };
}

