const moment = require('moment');
moment.locale('en-gb')
const { serverGroupsPaid, serversInfos, guildsInfo } = require("../../../../configs/config_geral")
const { connection2, panelApiKey } = require("../../../../configs/config_privateInfos")
const { connection } = require("../../../../configs/config_privateInfos")
const { CommandHandler } = require("../../../commands/commandHandler")
const { CheckDatabaseRole } = require("../../checkDatabaseRole");
const { ReloadRolesAndTags } = require('../../reloadRolesAndTags');
const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Options } = require('../../../ticket/Options_Ticket');
const { TicketLog } = require('../../../ticket/embed');
const { CheckServerAluguel } = require('../../checkServerAluguel');
const { Email } = require('../../../email');
const axios = require('axios').default
exports.CommandExecute = class {
  constructor(client) {
    this.client = client
    this.con = connection.promise()
    this.con2 = connection2.promise()
    this.guild = client.guilds.cache.get(guildsInfo.main)
  }
  async isSetted() {
    return false
  }
  async setCredits(steamid, command) {
    try {
      let [row] = await this.con.query(`SELECT id FROM store_players where authid REGEXP '${steamid.slice(8)}'`)
      if (row.length === 0) throw new Error('Player não encontrado!')
      await this.con.query(`UPDATE store_players set credits = credits + ${Number(command.beneficio)} where id = ${row[0].id}`)
      return true
    } catch (error) {
      return { error: error.message }
    }
  }
  async setSkins(steamid, command) {
    try {
      let [row] = await this.con.query(`SELECT id FROM store_players where authid REGEXP '${steamid.slice(8)}'`)
      if (row.length === 0) throw new Error('Player não encontrado!')
      let [row2] = await this.con.query(`SELECT unique_id FROM store_items where player_id = ${row[0].id} and unique_id = '${command.beneficio}'`)
      if (row2.length > 0) return { error: `Player ja possuia a skin ${command.beneficio}` }
      await this.con.query(`INSERT INTO store_items (player_id, type, unique_id, date_of_purchase, date_of_expiration, price_of_purchase) VALUES (${row[0].id}, 'playerskin', '${command.beneficio}', ${Date.now().toString().slice(0, -3)}, '0', '0')`)

      return true
    } catch (error) {
      return { error: error.message }
    }
  }
  async setVip(steamid, discord, pacote) {
    let fetchedUser
    if (!pacote.name.includes('VIP')) {

      try {
        fetchedUser = await this.guild.members.cache.get(discord)
      } catch (error) { }

      if (!fetchedUser) try {
        fetchedUser = await this.guild.members.fetch(discord)
      } catch (error) { }

      if (!fetchedUser && !pacote.name.includes('VIP')) return { error: 'Discord não foi encontrado!' }
    }

    let flags = serverGroupsPaid[pacote.name.includes('VIP') || pacote.name.includes('GERENTE') ? pacote.name.split(' ')[0].toLowerCase() : pacote.name.split(' ')[0].toLowerCase().replace('+', 'plus') + 'p']
    pacote.commands.command.servidor.map(async server => {

      let serverFind = server == 'todos' ? serversInfos : serversInfos.filter(m => m.name == server)
      try {
        await CheckDatabaseRole(steamid, serverFind.length > 1 ? '0' : serverFind[0].serverNumber, true, flags, pacote.commands.command.beneficio, discord ? typeof discord == 'object' ? discord.id : discord.replace(/\D/g, '') : undefined)
      } catch (error) {
        console.log(error)
        return { error: error.message }
      }
      try {
        ReloadRolesAndTags(serverFind.flatMap(m => m.identifier.map(i => i)))
      } catch (error) { }
      if (!pacote.name.includes('VIP')) {
        try {
          if (server != 'todos') {
            serverFind = serverFind[0]
            fetchedUser.roles.add([serverFind.tagComprado, '722814929056563260'])

            if (!fetchedUser.user.username.includes('Savage |')) {
              fetchedUser.setNickname('Savage | ' + fetchedUser.user.username);

            }
          } else {
            fetchedUser.roles.add(serversInfos.map(m => m.tagComprado).concat('722814929056563260'))
          }
        } catch (error) { }

      }
    })
  }
  async setUnban_Unmute(steamid, discord, name) {
    let commandHandler = new CommandHandler(this.client)

    try {
      if (name == 'UNBAN')
        return await commandHandler.removeBan(steamid, 'Comprado na Loja', discord, 'Loja')
      else
        return await commandHandler.removeMute(steamid, 'Comprado na Loja')
    } catch (error) {
      return { error: error.message }
    }
  }
  async setServidor(steamid, email, command, created_at) {

    let rows
    try {
      [rows] = (await this.con2.query(`SELECT * FROM Servidor_Aluguel where end_at IS NULL OR LENGTH(end_at) < 2 OR steamid regexp "${steamid.slice(8)}" order by -end_at DESC `))[0]
      if (!rows) throw new Error('Não há servidores disponíveis, tente novamente mais tarde!')

    } catch (error) {
      return { error: 'Linha 104 ' + error.message }
    }


    let response = await axios.get(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        }
      }).catch(err => undefined)
    if (!response) return { error: 'Aconteceu algum erro na hora de ler o arquivo server.cfg!' }

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

    if (!response) return { error: 'Aconteceu algum erro na hora de escrever  no arquivo server.cfg!' }

    const panel_password = ((length = 10, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#') => Array(length).fill(0).map(() => wishlist[Math.floor(Math.random() * (wishlist.length + 1))]).join(''))()

    try {
      await this.con2.query(`
      UPDATE Servidor_Aluguel SET 
      password ='${password}',
      steamid ='${steamid}',
      tempo = ${command.beneficio},
      token = '',
      email = '${email}',
      panel_password = '${panel_password}',
      created_at = '${moment(created_at).local().format('DD-MM-YYYY HH:mm:ss')}',
      end_at = '${moment().local().add(command.beneficio, 'd').format('DD-MM-YYYY HH:mm:ss')}'
      WHERE id = ${rows.id}
  `)
    } catch (error) {
      console.log(error)
      return { error: 'Erro interno ou servidor ja cadastrado' }

    }

    await new Email({ client_email: email }).serverCreated(panel_password)

    try {
      await this.con2.query(`DELETE FROM Cargos WHERE server_id = ${rows.server_id}`)
    } catch (error) {
      console.log(error)
      return { error: 'Erro ao deletar os admins' }
    }

    try {
      await this.con2.query(`INSERT IGNORE INTO Cargos
      (playerid, enddate, flags, server_id) 
      VALUES ('${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${command.beneficio} DAY)), 'a/z/t', ${rows.server_id})`)

    } catch (error) {
      console.log(error)
      return { error: 'Erro ao setar o admin' }
    }

    response = await axios.post(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/power`, { signal: 'restart' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        },

      }).catch(err => undefined)

    if (!response) return { error: 'Aconteceu algum erro na hora de ligar o servidor!' }
    let finalDate = new Date(new Date().getTime() + (command.beneficio * 24 * 60 * 60 * 1000)).toLocaleString('en-GB')

    const logServidor = new EmbedBuilder()
      .setColor('#0066FF')
      .setTitle(`${rows.name.toUpperCase()} - ${command.beneficio} Dias`)
      .addFields(
        { name: 'Steamid', value: `${steamid}`, inline: false },
        { name: 'Tempo', value: `${command.beneficio} Dias`, inline: false },
        { name: 'Termino', value: `${finalDate}`, inline: false },
        { name: 'Valor', value: `${command.beneficio == 1 ? '10' : command.beneficio == 7 ? '25' : '65'}`, inline: false },
        { name: 'Valor ASCP', value: `${(1.65 * command.beneficio).toFixed(2)}`, inline: false },
        { name: 'Servidor', value: `${rows.name} - ${rows.identifier}`, inline: false },
        { name: 'IP', value: `${rows.ip}`, inline: false },
      )
      .setTimestamp()

    this.client.guilds.cache.get('792575394271592458').channels.cache.get('1100435745832960203').send({ embeds: [logServidor] })


    CheckServerAluguel(this.client)

    let demoDelete
    try {
      demoDelete = await axios.get(`https://panel.mjsv.us/api/client/servers/${rows.identifier}/files/list?directory=%2Fcsgo%2Fwarmod`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          },
        })
    } catch (err) { return console.log(err) }

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

    } catch (err) { return console.log(err) }
  }
  async setDatabaseCompras(sale) {
    try {
      const [row] = (await this.con2.query(`SELECT * FROM Compras WHERE internal_id = '${sale.internal_id}'`))[0]
      if (row) {
        await this.con2.query(
          `UPDATE Compras SET
            steamid = '${sale.client_identifier}',
            discord_id = '${sale.client_discord}',
            created_at = '${moment(sale.created_at, 'DD-MM-YYYY HH:mm:ss').local().format('DD-MM-YYYY HH:mm:ss')}'
            WHERE id = '${row.id}'
          `
        )


      } else {
        await this.con2.query(
          `INSERT INTO Compras 
            (
              internal_id, steamid, 
              discord_id, name, 
              email, cpf, 
              total_price, payment_method, 
              cupom, cupom_type, 
              cupom_value, created_at
            )
          VALUES
            (
              '${sale.internal_id}', '${sale.client_identifier}',
              '${sale.client_discord}', '${sale.client_name}',
              '${sale.client_email}', '${sale.client_document}',
              '${sale.price}', '${sale.gateway}',
              '${sale.promo_code}', '${sale.promo_type}',
              '${sale.promo_value}', '${moment(sale.created_at, 'DD-MM-YYYY HH:mm:ss').local().format('DD-MM-YYYY HH:mm:ss')}'
          )`
        )
      }
    } catch (error) {
      console.log(error)
      return { error: 'Função setDatabaseCompras: ' + error.message }
    }
  }
  async setDatabaseCompras_Pacotes(internal_id, pacote) {
    try {
      const [row] = (await this.con2.query(`SELECT * FROM Compras_Pacotes WHERE internal_id = '${internal_id}' AND command = '${JSON.stringify(pacote.commands.command)}'`))[0]

      if (row) {
        await this.con2.query(
          `UPDATE Compras_Pacotes SET
            price = '${pacote.price}',
            created_at = '${moment().local().format('DD-MM-YYYY HH:mm:ss')}'
            WHERE id = '${row.id}'
          `
        )
      } else {
        await this.con2.query(`
      INSERT INTO Compras_Pacotes
        (
          internal_id, command, price, created_at
        )
      VALUES
        (
          '${internal_id}', '${JSON.stringify(pacote.commands.command)}','${pacote.price}', '${moment().local().format('DD-MM-YYYY HH:mm:ss')}'
        )
      `)
      }
    } catch (error) {
      console.log(error)
      return { error: 'Função setDatabaseCompras_Pacotes: ' + error.message }
    }
  }

}