const { EmbedBuilder } = require('discord.js')
const { panelApiKey, connection2 } = require('../../../configs/config_privateInfos')
const { CheckServerAluguel } = require('../../../handle/checks/checkServerAluguel')
const moment = require('moment')
const { Email } = require('../../../handle/email')
moment.locale('en-gb')
const axios = require('axios').default

exports.CriarServidor = async function (client, interaction, steamid, email, tempo, valor, serverid, fromSetarDirectly) {

  async function handleMessage(content, first, toDelete, last) {
    if (fromSetarDirectly) {

      if (first) {
        await interaction.deferReply()
        return await interaction.followUp(content)
      } else {
        return await interaction.editReply(content).then((m) => toDelete ? setTimeout(() => {
          interaction.deleteReply()
        }, 5000) : last ? m.pin() : '')
      }
    } else {
      if (last) return await interaction.channel.send(content).then(m => m.pin())
      return interaction.edit(content).then((m) => toDelete ? setTimeout(() => {
        m.delete()
      }, 5000) : '')
    }
  }

  await handleMessage('**Buscando servidores, aguarde** <a:savage_loading:837104765338910730>', true)

  valor ? valor : valor = tempo == 30 ? 65 : tempo == 7 ? 25 : 10

  const con = connection2.promise();

  let [rows] = await con.query(`SELECT * FROM Servidor_Aluguel where ${serverid ? `server_id=${serverid}` : 'end_at IS NULL OR LENGTH(end_at) < 2'} `).catch(() => undefined)

  if (!rows || rows == '') {
    await handleMessage('***Não há servidores disponíveis, tente novamente mais tarde!***', false, true)
    return false
  }

  rows = rows[0]

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
    await handleMessage('***Aconteceu algum erro na hora de ler o arquivo server.cfg!***', false, true)
    return false
  }

  let index = response.data.indexOf('sv_password')
  let password = (Math.random() + 1).toString(36).substring(7)
  let data = response.data.replace(response.data.substring(index, response.data.indexOf('\n', index)), `sv_password ${password}`)

  response = await axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg`, data,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
        'Authorization': `Bearer ${panelApiKey.api}`,
      },

    }).catch(err => undefined)

  if (!response) {
    await handleMessage('***Aconteceu algum erro na hora de escrever  no arquivo server.cfg!***', false, true)
    return false
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
    await handleMessage('***Aconteceu algum erro na hora de ligar o servidor!***', false, true)
    return false
  }
  const panel_password = ((length = 10, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#') => Array(length).fill(0).map(() => wishlist[Math.floor(Math.random() * (wishlist.length + 1))]).join(''))()

  try {
    await con.query(`
    UPDATE Servidor_Aluguel SET 
    password ='${password}',
    steamid ='${steamid}',
    tempo = ${tempo},
    email = '${email}',
    panel_password = '${panel_password}',
    created_at = '${moment().local().format('DD-MM-YYYY HH:mm:ss')}',
    end_at = '${moment().local().add(tempo, 'd').format('DD-MM-YYYY HH:mm:ss')}'
    WHERE id = ${rows.id}
`)
  } catch (error) {
    console.log(error)
    await handleMessage('***Erro interno ou servidor ja cadastrado***', false, true)
    return false
  }
  new Email({ client_email: email }).serverCreated(password)
  try {
    await this.con2.query(`INSERT IGNORE INTO Cargos
    (playerid, enddate, flags, server_id) 
    VALUES ('${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${tempo} DAY)), 'a/z/t', ${rows.server_id})`)

  } catch (error) {
    console.log(error)
    await handleMessage('***Erro ao setar o admin***', false, true)
  }

  var finalDate = new Date(new Date().getTime() + (tempo * 24 * 60 * 60 * 1000)).toLocaleString('en-GB')

  await handleMessage({ content: 'Criado!', }, false, false, true)

  const logServidor = new EmbedBuilder()
    .setColor('#0066FF')
    .setTitle(`MIX - ${tempo} Dias`)
    .addFields(
      { name: 'Steamid', value: `${steamid}`, inline: false },
      { name: 'Tempo', value: `${tempo} Dias`, inline: false },
      { name: 'Termino', value: `${finalDate}`, inline: false },
      { name: 'Valor', value: `${valor}`, inline: false },
      { name: 'Valor ASCP', value: `${(1.65 * tempo).toFixed(2)}`, inline: false },
      { name: 'Servidor', value: `${rows.name} - ${rows.identifier}`, inline: false },
      { name: 'IP', value: `${rows.ip}`, inline: false },
    )
    .setTimestamp()

  client.guilds.cache.get('792575394271592458').channels.cache.get('1100435745832960203').send({ embeds: [logServidor] })

  CheckServerAluguel(client)

  let demoDelete
  try {
    demoDelete = await axios.get(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/list?directory=%2Fcsgo%2Fwarmod`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        },
      })
  } catch (err) { console.log(err.data) }

  if (demoDelete.data.data.length == 0) return;

  try {
    axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/delete`, {
      "root": "/csgo/warmod",
      "files":
        demoDelete.data.data.map(m => m.attributes.name)

    },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        },
      })

  } catch (err) { console.log(err.data) }

  return true
}