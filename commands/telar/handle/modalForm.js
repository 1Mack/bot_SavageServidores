const { ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const { serversInfos } = require("../../../configs/config_geral");
const { Verification } = require("./verifications");

exports.ModalForm = async function (interaction) {
  const textInput = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId('nick')
        .setLabel('Nick')
        .setPlaceholder('Tente escrever o nick igual a steam dele, para que ele seja kikado')
        .setStyle(TextInputStyle.Short),
    )
  const textInput2 = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId('steamid')
        .setLabel('Steamid ou link do perfil')
        .setStyle(TextInputStyle.Short),
    )
  const textInput3 = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId('servidor')
        .setLabel('Servidor')
        .setPlaceholder(serversInfos.map(sv => sv.name).join(', '))
        .setStyle(TextInputStyle.Paragraph),
    )
  const textInput4 = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId('anydesk')
        .setLabel('Anydesk (opcional)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short),
    )
  const textInput5 = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId('observacoes')
        .setLabel('Observações (opcional)')
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph),
    )

  const modal = new ModalBuilder()
    .setCustomId('embed_modal')
    .addComponents(textInput, textInput2, textInput3, textInput4, textInput5)
    .setTitle("Preencha as informações corretamente!")

  await interaction.showModal(modal);
  const filter = (interaction) => interaction.customId === 'embed_modal';

  const interactionResult = await interaction.awaitModalSubmit({ filter, time: 120000 })

  interaction.message.delete()

  return (
    {
      nick: interactionResult.fields.getTextInputValue('nick'),
      steamid: await Verification(interaction, interactionResult.fields.getTextInputValue('steamid')),
      servidor: await Verification(interaction, interactionResult.fields.getTextInputValue('servidor')),
      anydesk: interactionResult.fields.getTextInputValue('anydesk'),
      observacoes: interactionResult.fields.getTextInputValue('observacoes'),
      i: interactionResult
    }
  )

}