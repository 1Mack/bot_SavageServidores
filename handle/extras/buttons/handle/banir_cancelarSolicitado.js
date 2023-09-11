const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { BanirTemp } = require("../../../../commands/ban/handle/banir");
const { CommandHandler } = require("../../../commands/commandHandler");
const { Banlog } = require("../../../../commands/ban/handle/embed");

exports.Solicitado_banirCancelar = async function (interaction, client, type) {

  if (!interaction.member.roles.cache.has('778273624305696818')) {
    return interaction.reply({ content: 'Voce não pode reagir a esse botão!', ephemeral: true })
  }
  await interaction.deferUpdate()
  const primaryButtons = interaction.message.components
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('CANCELAR AÇÃO')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('CONCLUIR AÇÃO')
      .setStyle(ButtonStyle.Danger)

  )

  interaction.message.edit({ components: [button] })

  const filter = i => {
    i.deferUpdate();
    return i.user.id === interaction.user.id && i.message.id == interaction.message.id;
  };

  const response = await interaction.message.channel
    .awaitMessageComponent({ filter, time: 50000, componentType: ComponentType.Button, errors: ['time'] }).catch(() => undefined)

  if (!response) {
    interaction.message.edit({ components: primaryButtons })
    return interaction.channel.send(`${interaction.user} | ***Houve um erro ao tentar proceguir coma ação!***`).then(m => setTimeout(() => {
      m.delete()
    }, 5000))
  }

  if (response.customId == 'cancel') {
    interaction.message.edit({ components: primaryButtons })
    return interaction.channel.send(`${interaction.user} | ***Ação cancelada com sucesso!***`).then(m => setTimeout(() => {
      m.delete()
    }, 5000))
  } else if (type == 'banirSolicitado') {
    const [nick, steamid, reason] = [interaction.message.embeds[0].fields[0].value, interaction.message.embeds[0].fields[1].value, interaction.message.embeds[0].fields[5].value]

    const commandHandler = await new CommandHandler(client).ban(nick, steamid, '0', reason)

    if (commandHandler['error']) {
      interaction.message.edit({ components: primaryButtons })
      return interaction.channel.send(`${interaction.user} | ***Houve um erro ao tentar proceguir coma ação!***\n\n\`\`\`${commandHandler.error}\`\`\``).then(m => setTimeout(() => {
        m.delete()
      }, 5000))
    }
    changeEmbedInfos(type)
    interaction.guild.channels.cache.get('721854111741509744').send({ embeds: [Banlog(nick, steamid, '0', reason, interaction.user)] });

  } else {
    changeEmbedInfos(type)
  }

  function changeEmbedInfos(type) {
    let messageEmbed = interaction.message.embeds
    if (type == 'banirSolicitado') {
      for (let i in messageEmbed) {
        messageEmbed[i].data.color = '15548997'
      }
      messageEmbed[0].data.title = `BANIDO - ${interaction.user.username}`
    } else if (type == 'cancelarSolicitado') {
      for (let i in messageEmbed) {
        messageEmbed[i].data.color = '2303786'
      }
      messageEmbed[0].data.title = `REPROVADO - ${interaction.user.username}`
    } else {
      for (let i in messageEmbed) {
        messageEmbed[i].data.color = '2303786'
      }
      messageEmbed[0].data.title = `JÁ BANIDO -  ${interaction.user.username}`
    }
    interaction.message.edit({ embeds: messageEmbed, components: [] })
  }

}