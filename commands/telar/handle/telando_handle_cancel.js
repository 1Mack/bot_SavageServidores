const { ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { ModalForm } = require("./modalForm");

exports.Telando_handle_cancel = async function (interaction) {

  let findChannel = interaction.guild.channels.cache.get(interaction.channelId),
    [, , teladorDiscord] = findChannel.name.split('→')

  if (interaction.user.id !== teladorDiscord) return;

  const button = new ActionRowBuilder().addComponents(
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
  interaction.reply('<:blank:773345106525683753>')
  interaction.deleteReply()
  await interaction.message.edit(
    {
      content: `Tem certeza que quer excluir a sala?`,
      components: [button]
    }
  )
  const filter2 = i => {
    i.deferUpdate();
    return i.user.id === interaction.user.id;
  };

  await interaction.channel.awaitMessageComponent({ filter2, componentType: ComponentType.Button, time: 60000 })
    .then(async (i) => {
      if (i.customId === 'cancel') {
        const buttonFinal = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('telando_cancelar')
            .setLabel('ENCERRAR SALA')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('telando_banir')
            .setLabel('BANIR')
            .setStyle(ButtonStyle.Danger)

        )
        await findChannel.bulkDelete(100)

        return findChannel.send({ content: '<:blank:773345106525683753>', components: [buttonFinal] })

      } else if (i.customId === 'send_telados') {

        ModalForm(i).then(async ({ nick, steamid, servidor, anydesk, observacoes, i }) => {
          const embed = new EmbedBuilder().setAuthor({ name: `Nova Telagem Realizada` }).setColor('07e646').setFields(
            { name: 'Telador', value: `<@${teladorDiscord}>` },
            { name: 'Nick', value: nick },
            { name: 'SteamID', value: steamid },
            { name: 'Servidor', value: servidor.name },
            { name: 'Discord', value: `<@${targetDiscord}>` },
            { name: 'AnyDesk', value: anydesk ? anydesk : '\u200B' },
            { name: 'Observações', value: observacoes ? observacoes : '\u200B' },
          )
          interaction.guild.channels.cache.get('903453341944791041').send({ embeds: [embed] })
        })

        findChannel.delete()

      }
    })
}