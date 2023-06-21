const { EmbedBuilder } = require('discord.js')
const { panelApiKey, connection2 } = require('../../../configs/config_privateInfos')
const { AdminServidorAdicionar } = require('../../servidor/handle/admin/adicionar')
const { CheckServerAluguel } = require('../../../handle/checks/checkServerAluguel')
const axios = require('axios').default

exports.CriarServidor = async function (client, interaction, steamid, servidor, discord, tempo, valor, serverid, fromSetarDirectly) {

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

  let [rows] = await con.query(`SELECT * FROM Servidor_Aluguel where type = '${servidor}' and ${serverid ? `serverID=${serverid}` : '(endDate < DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 3 HOUR)  OR endDate is null)'} `).catch(() => undefined)

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

  try {
    await con.query(`
    UPDATE Servidor_Aluguel SET 
    password ='${password}',
    steamid ='${steamid}',
    discordID = '${discord.id}',
    tempo = ${tempo},
    enddate = (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${tempo} DAY))
    WHERE id = ${rows.id}
`)
  } catch (error) {
    await handleMessage('***Erro interno ou servidor ja cadastrado***', false, true)
    return false
  }

  try {
    await AdminServidorAdicionar(interaction, steamid, discord, tempo, `${rows.serverID}`)

  } catch (error) {
    await handleMessage('***Erro ao setar o admin***', false, true)
    return false
  }


  var finalDate = new Date(new Date().getTime() + (tempo * 24 * 60 * 60 * 1000)).toLocaleString('en-GB')

  const embed = new EmbedBuilder()
    .setTitle('Orientações Básicas (LEIA COM ATENÇÃO)')
    .setDescription(`
  <:blank:773345106525683753>
  **Comandos pelo Discord**
  > </servidor admin adicionar:1100497030029258772> → Adiciona um admin no seu servidor
  > </servidor admin remover:1100497030029258772> → Remove um admin no seu servidor
  > </servidor energia:1100497030029258772> → Liga ou Desliga o servidor
  > </servidor senha:1100497030029258772> → Altera a senha do servidor
  
  
  **Comandos Dentro do Servidor**
  > __!admin__ → Acesso a todos os comandos disponíveis
  > __!knife, !ws, !agents, !sticker__ → Para escolher faca, skin, agentes e sticker, respectivamente
  > __!mvp__ → Para mudar o som ao final da partida
  > __!fov__ → Para alterar o FOV do jogador
  > __!map nomeDoMapa__ → Para alterar o MAPA
  > __!r__ → Para se marcar como pronto (comando usado para poder começar a partida)
  > __!forceallready__ → Para marcar todos como pronto (comando usado para forçar o começo da partida)

  <:blank:773345106525683753>
  `)
    .setFields(
      { name: 'IP NAVEGADOR', value: `[steam://connect/${rows.ip}/${password}](https://conectar.savageservidores.com/${rows.ip}/${password})` },
      { name: 'IP CONSOLE', value: `connect ${rows.ip};password ${password}` },
      { name: 'DURAÇÃO', value: `${tempo} ${tempo == 1 ? 'Dia' : 'Dias'} - (${finalDate})` },
    ).setFooter({ text: `Servidor ${rows.name}` })

  await handleMessage({ content: '', embeds: [embed] }, false, false, true)

  interaction.member.roles.add('1106551221176766496')

  const logServidor = new EmbedBuilder()
    .setColor('#0066FF')
    .setTitle(`${servidor.toUpperCase()} - ${tempo} Dias`)
    .addFields(
      { name: 'Discord', value: `${discord}`, inline: false },
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

  return true
}