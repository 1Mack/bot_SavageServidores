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

    [rows] = await con.query(`SELECT * FROM Servidor_Aluguel where end_at IS NOT NULL AND LENGTH(end_at) > 0 ORDER BY end_at`)

  } catch (error) { console.log(error) }

  if (!rows || rows == '') return;

  for (let row of rows) {

    const endDate = moment(row.end_at, 'DD-MM-YYYY HH:mm:ss').local();
    let currentDate = moment().local()

    schedule.scheduleJob(row.server_id.toString(), currentDate.isAfter(endDate) ? currentDate.add(3, 'seconds').toLocaleString() : endDate.toLocaleString(), async function () {
      await con.query(
        `UPDATE Servidor_Aluguel SET 
          password = '',
          steamid = '',
          tempo = '',
          email = '',
          panel_password = '',
          token = '',
          created_at = '',
          end_at = ''
          WHERE identifier = '${row.identifier}'`

      )
      await con.query(`DELETE FROM Cargos WHERE server_id = ${row.server_id}`)

      let response
      response = await axios.get(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        }).catch(err => undefined)

      if (response) {

        let index = response.data.indexOf('sv_password')
        let data = response.data.replace(response.data.substring(index, response.data.indexOf('\n', index)), `sv_password vazio${row.server_id}`)

        response = await axios.post(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg`, data,
          {
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json',
              'Authorization': `Bearer ${panelApiKey.api}`,
            },

          }).catch(err => {
            console.log(err)
            return undefined
          })

        if (!response) guild.channels.cache.get('770401787537522738').send(`<@323281577956081665> | Erro ao editar o server.cfg do servidor **${row.server_id}/${row.name}**`)

        response = await axios.post(`https://panel.mjsv.us/api/client/servers/${row.identifier}/power`, { signal: 'restart' },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${panelApiKey.api}`,
            },

          }).catch(err => undefined)

        if (!response) guild.channels.cache.get('770401787537522738').send(`<@323281577956081665> | Erro ao restartar o servidor **${row.server_id}/${row.name}`)

      } else {
        guild.channels.cache.get('770401787537522738').send(`<@323281577956081665> | Erro ao pegar informações do server.cfg do servidor **${row.server_id}/${row.name}`)
      }

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
      } catch (err) { }

      if (!demoDelete || demoDelete.data.data.length == 0) return;

      try {
        axios.post(`https://panel.mjsv.us/api/client/servers/${row.identifier}/files/delete`, {
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

      } catch (err) { guild.channels.cache.get('770401787537522738').send(`<@323281577956081665> | Erro ao deletar as demos do servidor **${row.server_id}/${row.name}**`) }
    })
  }
}