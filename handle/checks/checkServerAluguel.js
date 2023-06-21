const { EmbedBuilder, hyperlink } = require("discord.js");
const { connection2, panelApiKey } = require("../../configs/config_privateInfos")
const moment = require('moment');
moment.locale('en-gb')
const { guildsInfo } = require("../../configs/config_geral");
const schedule = require('node-schedule')
const axios = require('axios').default

exports.CheckServerAluguel = async function (client) {

  const con = connection2.promise()
  const guild = client.guilds.cache.get(guildsInfo.main)
  let rows

  try {

    [rows] = await con.query(`SELECT * FROM Servidor_Aluguel where endDate IS NOT NULL ORDER BY endDate`)

  } catch (error) { }

  if (!rows || rows == '') return;

  for (let row of rows) {

    const endDate = moment.utc(row.endDate).local().subtract(3, 'hours');
    let currentDate = moment.utc().local()

    schedule.scheduleJob(row.name, currentDate <= 0 ? currentDate.add(3, 'seconds').toISOString() : endDate.toISOString(), async function () {
      await con.query(
        `UPDATE Servidor_Aluguel SET 
          password = '',
          discordID = '',
          tempo = '',
          endDate = NULL,
          timestamp = NULL,
          steamid = ''
           
          WHERE identifier = '${row.identifier}'`

      )
      let response
      response = await axios.get(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        }).catch(err => undefined)

      if (!response) return 'VER ERRO'

      let index = response.data.indexOf('sv_password')
      let data = response.data.replace(response.data.substring(index, response.data.indexOf('\n', index)), `sv_password vazio${row.serverID}`)

      response = await axios.post(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg`, data,
        {
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          },

        }).catch(err => undefined)

      if (!response) return 'VER ERRO'

      response = await axios.post(`https://panel.mjsv.us/api/client/servers/${row.identifier}/power`, { signal: 'restart' },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          },

        }).catch(err => undefined)

      if (!response) return 'VER ERRO'

      const getMember = await guild.members.cache.get(row.discordID) || await guild.members.fetch(row.discordID)

      const findChannel = guild.channels.cache.find(ch => ch.topic === row.discordID)

      if (findChannel && (await findChannel.messages.fetchPinned()).size > 0) findChannel.send('<@323281577956081665> pode fechar')

      if (!getMember) return;


      const embed = new EmbedBuilder().
        setTitle('Servidor Alugado')
        .setDescription(`***Olá <@${row.discordID}>,***
        
        seu servidor acabou de vencer!
  
        Caso queira renovar, basta abrir um ${hyperlink('ticket de compras', 'https://discord.com/channels/343532544559546368/855200110685585419/927000168933511219')}
        <:blank:773345106525683753> 
        `)
        .addFields(
          { name: 'Tempo Alugado', value: `${row.tempo} Dias`, inline: false },
          { name: 'Alugado no dia', value: `${moment.utc(row.timestamp).local().subtract(3, 'hours').format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
          { name: 'Termino no dia', value: `${endDate.format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
          { name: 'Servidor Alocado', value: `${row.name}`, inline: false },
          { name: 'Tipo', value: `${row.type}`, inline: false },
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/814295769699713047/1117827179682738236/S_Logo.png')
        .setImage('https://cdn.discordapp.com/attachments/751428595536363610/837855972663754792/savage-servidores3.gif')
        .setFooter({ text: 'Savage Servidores', iconURL: 'https://cdn.discordapp.com/attachments/814295769699713047/1117827179682738236/S_Logo.png' })
        .setTimestamp()

      await getMember.send({ embeds: [embed] }).catch(() => { })

      if (getMember._roles.find('1106551221176766496')) {
        getMember.roles.remove('1106551221176766496').catch(() => { })
      }

    })


  }
}