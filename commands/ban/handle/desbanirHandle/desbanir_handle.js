const { Desbanir_approve } = require("./desbanir_approve");
const { serversInfos } = require('../../../../configs/config_geral');
const { panelApiKey } = require('../../../../configs/config_privateInfos');
const { UnbanGuildLog } = require("../embed");
const { InternalServerError } = require("../../../../embed/geral");
const axios = require('axios').default

exports.Desbanir_handle = async function (client, interaction, type, steamid, motivo, id) {

  const guildChannelMessages = await client.guilds.cache.get('792575394271592458').channels.cache.get('1057353383335444532').messages.fetch()

  const msgFound = await guildChannelMessages.find(msg => typeof type === 'object' ? msg.id === type.id : msg.id === interaction.message.id)

  id ? id : id = msgFound.embeds[0].data.fields.find(f => f.name.includes('ID')).value
  steamid ? steamid : steamid = msgFound.embeds[0].data.fields.find(f => f.name.includes('Steamid')).value
  motivo ? motivo : motivo = msgFound.embeds[0].data.fields.find(f => f.name.includes('Motivo')).value
  let userAuthor = msgFound.embeds[0].data.footer.text.replace('Desbanido Pelo ', '')

  if (type === 'cancel') {
    interaction.reply('**Escreva abaixo o motivo de cancelar o unban!**')

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

    interaction.guild.channels.cache.get('1067900204893863936').send({ embeds: [UnbanGuildLog(false, userAuthor, steamid, motivo, interaction.user, collected.content)] })

    return interaction.editReply({ content: '**Unban cancelado com sucesso!**' }).then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))

  } else {

    const unban = await Desbanir_approve(client, interaction, steamid, motivo, id)


    if (unban === 'desbanido') {
      msgFound.delete()

      if (interaction.guildId === '792575394271592458') {
        interaction.guild.channels.cache.get('1067900204893863936').send({ embeds: [UnbanGuildLog(true, userAuthor, steamid, motivo, interaction.user)] })
      } else {
        client.guilds.cache.get('792575394271592458').channels.cache.get('1067900204893863936').send({ embeds: [UnbanGuildLog(true, userAuthor, steamid, motivo, interaction.user)] })
      }

      interaction.channel.send({ content: '**Unmute concluído com sucesso!**' }).then((m) => setTimeout(() => {
        m.delete()
      }, 5000))

      return removeId()


    } else {
      if (unban === 'erro') {

        interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      } else {

        msgFound.delete()

        client.guilds.cache.get('792575394271592458').channels.cache.get('1067900204893863936').send({ embeds: [UnbanGuildLog(false, userAuthor, steamid, motivo, interaction.user, 'Não estava banido')] })

        interaction.reply('**Player não está banido!**').then(() => setTimeout(() => {
          interaction.deleteReply()
        }, 5000))
      }

    }

  }

  function removeId() {
    serversInfos.forEach(m => {
      m.identifier.forEach(id => {
        try {
          axios.post(`https://panel.mjsv.us/api/client/servers/${id}/command`,
            JSON.stringify({ command: `removeid STEAM_1:${steamid.slice(8)}; removeid STEAM_0:${steamid.slice(8)}` }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${panelApiKey.api}`,
              }
            })
        } catch (err) { }
      })
    })
  }

}