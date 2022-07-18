const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { guildsInfo } = require('../../../configs/config_geral');
const { HorasDemotarConfirm } = require('./horasDemotar');


exports.Diretor_DemotarConfirm = async function (interaction, client) {

  const guildLog = await client.guilds.cache.get(guildsInfo.log)
  await guildLog.members.fetch()
  const message = await guildLog.channels.cache.get(interaction.channelId).messages.fetch(interaction.message.id)
  const DiretorNumber = Math.floor(guildLog.members.cache.filter(m => m._roles.includes('875481156986998824')).size / 2) + 1

  const embed = new EmbedBuilder().setTitle(message.embeds[0].title).setFooter({ text: message.embeds[0].footer.text }).setColor('36393f'),
    row = new ActionRowBuilder()

  if (interaction.customId == 'horasdemotar_demotar2') {
    const { components } = message.components[0]

    if (interaction.user.id == '323281577956081665') return (
      await HorasDemotarConfirm(`pelo ${interaction.user}`, message, client),
      message.delete()
    )



    if (components[0].label === 'Demotar') {

      if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
        return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
      }

      embed.addFields(message.embeds[0].fields, { name: 'Diretores Favoráveis', value: `<@${interaction.user.id}>` })

      row.addComponents(
        new ButtonBuilder()
          .setCustomId('horasdemotar_demotar2')
          .setLabel(`Demotar 1/${DiretorNumber}`)
          .setStyle(ButtonStyle.Danger),
        components[1]
      )



    } else {
      let DemotarVoteValue = components[0].label.replace('Demotar ', '')

      if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
        return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
      }
      if (DemotarVoteValue === `${DiretorNumber}/${DiretorNumber}` || DemotarVoteValue === `${DiretorNumber - 1}/${DiretorNumber}`) return (
        await HorasDemotarConfirm('pelos **diretores**', message, client),
        message.delete(),
        interaction.reply({ content: 'Seu voto foi decisivo!!!', ephemeral: true })

      )

      DemotarVoteValue = DemotarVoteValue.replace(DemotarVoteValue.charAt(0), Number(DemotarVoteValue.charAt(0)) + 1)

      const embedField = message.embeds[0].fields.map(m => {
        if (m.name == 'Diretores Favoráveis') {
          m = { name: 'Diretores Favoráveis', value: `${m.value}, <@${interaction.user.id}>` }
        }

        return m
      })

      embed.addFields(embedField)

      row.addComponents(
        new ButtonBuilder()
          .setCustomId('horasdemotar_demotar2')
          .setLabel(`Demotar ${DemotarVoteValue}`)
          .setStyle(ButtonStyle.Danger),
        components[1]
      )

    }


  } else if (interaction.customId == 'horasdemotar_recusado') {
    const { components } = message.components[0]

    if (interaction.user.id == '323281577956081665') return message.delete()

    if (components[1].label === 'Rejeitar') {

      if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
        return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
      }

      embed.addFields(message.embeds[0].fields, { name: 'Diretores Contra', value: `<@${interaction.user.id}>` })

      row.addComponents(
        components[0],
        new ButtonBuilder()
          .setCustomId('horasdemotar_recusado')
          .setLabel(`Rejeitar 1/${DiretorNumber}`)
          .setStyle(ButtonStyle.Primary),
      )


    } else {
      let RejeitarVoteValue = components[1].label.replace('Rejeitar ', '')

      if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
        return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
      }
      if (RejeitarVoteValue === `${DiretorNumber}/${DiretorNumber}` || RejeitarVoteValue === `${DiretorNumber - 1}/${DiretorNumber}`) return (
        message.delete(),
        interaction.reply({ content: 'Seu voto foi decisivo!!!', ephemeral: true })

      )

      RejeitarVoteValue = RejeitarVoteValue.replace(RejeitarVoteValue.charAt(0), Number(RejeitarVoteValue.charAt(0)) + 1)

      const embedField = message.embeds[0].fields.map(m => {
        if (m.name == 'Diretores Contra') {
          m = { name: 'Diretores Contra', value: `${m.value}, <@${interaction.user.id}>` }
        }

        return m
      })

      embed.addFields(embedField)


      row.addComponents(
        components[0],
        new ButtonBuilder()
          .setCustomId('horasdemotar_recusado')
          .setLabel(`Rejeitar ${RejeitarVoteValue}`)
          .setStyle(ButtonStyle.Primary)
      )

    }


  }

  await message.edit({ embeds: [embed], components: [row] })
  interaction.reply({ content: 'Voto concluído com sucesso!!!', ephemeral: true })
}