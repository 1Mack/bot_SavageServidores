const { ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require("discord.js")
const axios = require('axios').default
const { connection2, panelApiKey } = require("../../../configs/config_privateInfos")
const wait = require('util').promisify(setTimeout);

exports.EnergiaServidor = async function (interaction, power) {
  const con = connection2.promise()
  
  let [rows] = await con.query(`SELECT * FROM Servidor_Aluguel WHERE discordID = ${interaction.user.id} AND endDate > DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 3 HOUR)`).catch(() => undefined)

  if (!rows || rows == '') {
    return interaction.reply(!rows ? 'Houve um erro interno, entre em contato com o 1Mack ou tente novamente mais tarde' : 'Não há nenhum servidor ou seu servidor já expirou')
  }

  await interaction.deferReply()

  if (rows.length > 1) {
    const button = new ActionRowBuilder().addComponents(
      rows.map(m => new ButtonBuilder()
        .setCustomId(m.identifier)
        .setLabel(m.name)
        .setStyle(ButtonStyle.Primary))

    )
    interaction.followUp({ content: `Encontrei ${rows.length} servidores em seu cadastro, escolha qual deles você quer mudar a senha`, components: [button] })

    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 })
      .then(async ({ customId }) => {
        rows = rows.find(m => m.identifier == customId)

      }).catch(() => interaction.editReply('Você não respondeu a tempo!'), setTimeout(() => {
        interaction.deleteReply()
      }, 5000))
  } else {
    rows = rows[0]
  }

  let response = await axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/power`, { signal: power },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${panelApiKey.api}`,
      },

    }).catch(err => undefined)

  if (!response) {
    interaction.followUp('***Aconteceu algum erro na hora de ligar o servidor!***').then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))
    return false
  }

  let errCont = 0

  interaction.followUp(`***Servidor executando o comando de energia __${power}__ <a:savage_loading:837104765338910730>!***`)

  do {
    response = await axios.get(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/resources`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        },

      }).catch(err => undefined)

    if (!response) errCont += 1



    if (power === 'restart') {
      if (response && response.data.attributes.current_state === 'running') {
        interaction.editReply('***Servidor foi ligado com sucesso!***').then(() => setTimeout(() => {
          interaction.deleteReply()
        }, 5000))
        return false
      }
    } else if (power === 'stop') {
      if (response && response.data.attributes.current_state === 'offline') {
        interaction.editReply('***Servidor foi desligado com sucesso!***').then(() => setTimeout(() => {
          interaction.deleteReply()
        }, 5000))
        return false
      }
    }

    if (errCont === 3) {
      interaction.editReply('***A ação não pode ser concluida!***').then(() => setTimeout(() => {
        interaction.deleteReply()
      }, 5000))
      return false
    } else {
      interaction.editReply(`***Servidor executando o comando de energia __${power}__\n\nStatus atual: ${!response ? 'Indefinido' : response.data.attributes.current_state} <a:savage_loading:837104765338910730>!***`)
    }
    await wait(3000)

  } while (true)
}