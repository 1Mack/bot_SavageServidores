const { Desmutar_approve } = require("./desmutar_approve");
const { serversInfos } = require('../../../../configs/config_geral');
const { panelApiKey } = require('../../../../configs/config_privateInfos');
const { UnMuteGuildLog } = require("../embed");
const { InternalServerError } = require("../../../../embed/geral");


exports.Desmutar_handle = async function (client, interaction, type, steamid, motivo, tipo, id) {

  const guildChannelMessages = await client.guilds.cache.get('792575394271592458').channels.cache.get('1057353383335444532').messages.fetch()

  const msgFound = await guildChannelMessages.find(msg => typeof type === 'object' ? msg.id === type.id : msg.id === interaction.message.id)

  id ? id : id = msgFound.embeds[0].data.fields.find(f => f.name.includes('ID')).value
  steamid ? steamid : steamid = msgFound.embeds[0].data.fields.find(f => f.name.includes('Steamid')).value
  motivo ? motivo : motivo = msgFound.embeds[0].data.fields.find(f => f.name.includes('Motivo')).value
  tipo ? tipo : tipo = msgFound.embeds[0].data.fields.find(f => f.name.includes('Tipo')).value
  let userAuthor = msgFound.embeds[0].data.footer.text.replace('Desmutado Pelo ', '')

  if (type === 'cancel') {
    interaction.reply('**Escreva abaixo o motivo de cancelar o unmute!**')

    let filter = msg => {
      return msg.author.id == interaction.user.id && interaction.channelId == msg.channel.id;
    };

    let collected = await interaction.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 600000,
        errors: ['time'],
      }).catch(() => { })
    if (!collected) {
      interaction.editReply('Você não respondeu a tempo!')
      return setTimeout(() => {
        interaction.deleteReply()
      }, 5000);
    }
    collected = await collected.first()
    collected.delete()
    msgFound.delete()

    interaction.guild.channels.cache.get('1067900204893863936').send({ embeds: [UnMuteGuildLog(false, userAuthor, steamid, motivo, interaction.user, collected.content)] })

    return interaction.editReply({ content: '**Unmute cancelado com sucesso!**' }).then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))

  } else {

    const unmute = await Desmutar_approve(client, interaction, steamid, motivo, tipo, id)


    if (unmute === 'desmutado') {
      msgFound.delete()
      if (interaction.guildId === '792575394271592458') {
        interaction.guild.channels.cache.get('1067900204893863936').send({ embeds: [UnMuteGuildLog(true, userAuthor, steamid, motivo, interaction.user)] })
      } else {
        client.guilds.cache.get('792575394271592458').channels.cache.get('1067900204893863936').send({ embeds: [UnMuteGuildLog(true, userAuthor, steamid, motivo, interaction.user)] })
      }

      interaction.channel.send({ content: '**Unmute concluído com sucesso!**' }).then((m) => setTimeout(() => {
        m.delete()
      }, 5000))

      return;


    } else {
      if (unmute === 'erro') {

        interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      } else {

        msgFound.delete()

        client.guilds.cache.get('792575394271592458').channels.cache.get('1067900204893863936').send({ embeds: [UnMuteGuildLog(false, userAuthor, steamid, motivo, interaction.user, 'Não estava mutado')] })
        interaction.reply('**Player não está mutado!**').then(() => setTimeout(() => {
          interaction.deleteReply()
        }, 5000))
      }

    }

  }
}