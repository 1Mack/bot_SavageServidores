const axios = require("axios").default
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const { connection2, panelApiKey } = require("../../../configs/config_privateInfos")

exports.SenhaServidor = async function (interaction, senha) {

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

  let response
  response = await axios.get(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${panelApiKey.api}`,
      }
    }).catch(err => undefined)

  if (!response) {
    return interaction.followUp('***Aconteceu algum erro na hora de ler o arquivo server.cfg!***').then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))
  }

  let index = response.data.indexOf('sv_password')
  let data = response.data.replace(response.data.substring(index, response.data.indexOf('\n', index)), `sv_password ${senha}`)

  response = await axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg`, data,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
        'Authorization': `Bearer ${panelApiKey.api}`,
      },

    }).catch(err => undefined)

  if (!response) {
    return interaction.followUp('***Aconteceu algum erro na hora de escrever  no arquivo server.cfg!***').then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))

  }

  response = await axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/power`, { signal: 'restart' },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${panelApiKey.api}`,
      },

    }).catch(err => undefined)

  if (!response) {
    return interaction.followUp('***Aconteceu algum erro na hora de ligar o servidor!***').then(() => setTimeout(() => {
      interaction.deleteReply()
    }, 5000))
  }

  await con.query(`UPDATE Servidor_Aluguel SET password = '${senha}' WHERE identifier = '${rows.identifier}'`).catch(() =>
    interaction.followUp('***<@323281577956081665> A senha foi alterada, mas houve erro para salvá-la na database!***'))


  return interaction.followUp(`> **IP NAVEGADOR:** [steam://connect/${rows.ip}/${senha}](https://conectar.savageservidores.com/${rows.ip}/${senha})\n> **IP CONSOLE: **connect ${rows.ip};password ${senha}`)
}