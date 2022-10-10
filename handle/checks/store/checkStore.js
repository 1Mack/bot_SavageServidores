const { serversInfos } = require("../../../configs/config_geral");
const { connection2, connection, storePanelToken } = require("../../../configs/config_privateInfos");
const { ReloadRolesAndTags } = require("../reloadRolesAndTags");

const api = require("./api");
const webhook = require("./webhook");
const con = connection2.promise();
const con2 = connection.promise();

exports.RunStore = function () {
  console.log("> FIVE-M.STORE");
  console.log("> TOKEN: " + storePanelToken.token.replace(/./g, "*"));

  process.stdin.on("data", async (data) => {
    const runner = data.toString().replace("\n", "").trim();

    if (runner.length === 0) return;
    try {
      const result = await eval(runner);
      console.log("Response: " + result);
    } catch (ex) {
      console.log(ex)
    }
  });




  const check = async () => {


    const packages = await asyncOnlineFilter(await api.packages());
    const refunds = await asyncOnlineFilter(await api.refunds());

    for (let pkg of packages) {
      let checkProcess = await processSale(pkg, "Aprovado")

      if (checkProcess) {
        packages.splice(packages.findIndex(i => i.id == checkProcess), 1)

      }

    }
    for (let pkg of refunds) processSale(pkg, "Reembolso");

    if (packages.length) await api.delivery(packages.map((s) => s.id));
    if (refunds.length) await api.punish(refunds.map((s) => s.id));

  };

  check();
  setInterval(check, 60000);
}

async function processSale(sale, type) {
  if (sale.commands.length > 0) {

    sale.player = toSteamID(sale.player)

    let msg = [
      { name: 'ID', value: '\u200B', inline: true },
      { name: `${sale.id}`, value: '\u200B', inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
      { name: 'Status', value: '\u200B', inline: true },
      { name: `${type}`, value: '\u200B', inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
      { name: 'SteamID', value: '\u200B', inline: true },
      { name: `${sale.player}`, value: '\u200B', inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
    ]



    sale.products = Object.entries(sale.products).flatMap(m => m[1])

    sale.commands = sale.commands.map(m => m.split(','))

    let newArray = []

    sale.commands.map((m, i) => {

      m[2] = [m[2]]

      if (i == 0) {
        newArray.push(m)

      } else if (newArray.find(m2 => (m2[0] == m[0]) && m2[1] != 'null')) {

        let position = newArray.findIndex(m2 => m2[0] == m[0])

        if (!newArray[position][2].includes(m[2].join(''))) {

          newArray[position][2].push(m[2].join(''))

        } else if (newArray[position][0] == 'creditos') {
          newArray[position][1] = Number(newArray[position][1]) + Number(m[1])
        }

      } else {
        newArray.push(m)

      }

    })
    let cont = 0
    newArray.forEach((mainArray, index) => {
      cont++
      msg.push(
        { name: `\u200B`, value: `\u200B`, inline: false },
        { name: `Pacote ${cont}`, value: `${sale.products[index]}`, inline: true },
        { name: `Servidor ${cont}`, value: `[${mainArray[2]}]`, inline: true },
      )

      if (!['unmute', 'ungag', 'unban', 'staff', 'skin_exclusiva'].includes(mainArray[0])) {

        if (['creditos'].includes(mainArray[0])) {
          sale.commands = `UPDATE store_players set credits = credits + ${mainArray[1]} where authid REGEXP '${sale.player.slice(8)}'`
          try {
            con2.query(sale.commands);

          } catch (ex) {
            console.log(ex)
            return sale.id
          }
        } else if (mainArray[0] == 'skin') {
          async function setSkin() {

            let row, row2;
            try {
              [row] = await con2.query(`SELECT id FROM store_players where authid REGEXP '${sale.player.slice(8)}'`)

              if (row.length === 0) throw new Error('Player não encontrado!')

            } catch (error) {
              console.log(error)
              return sale.id
            }

            try {
              [row2] = await con2.query(`SELECT unique_id FROM store_items where player_id = '${row[0].id}' AND unique_id = '${mainArray[1]}'`)

              if (row2.length > 0) throw new Error('Esse player já possui essa skin!')

              let dateNow = Date.now().toString().slice(0, -3)

              sale.commands = `INSERT INTO store_items (player_id, type, unique_id, date_of_purchase, date_of_expiration, price_of_purchase) VALUES ('${row[0].id}', 'playerskin', '${mainArray[1]}', ${dateNow}, '0', '0')`

            } catch (error) {
              console.log(error)
              return sale.id
            }
            try {
              con2.query(sale.commands);

            } catch (ex) {
              console.log(ex)
              return sale.id
            }
          }
          setSkin()
        } else {

          mainArray[2].forEach(async (command) => {

            command == 'todos' ? command = '0' : command
            let res
            try {
              [res] = await con.query(
                `SELECT * FROM Cargos 
                              WHERE playerid like '%${sale.player.slice(8)}' 
                              AND server_id = ${command} 
                              AND flags = '${mainArray[0]}'`);
            } catch (error) {
              return console.log(error)
            }

            if (res.length > 0) {
              sale.commands = `UPDATE Cargos SET enddate = (DATE_ADD(\`enddate\`, INTERVAL ${mainArray[1]} DAY)) WHERE playerid REGEXP '${sale.player.slice(8)}' AND server_id = ${command} AND flags = '${mainArray[0]}'`
            } else {
              sale.commands = `INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id) VALUES (NULL, NULL, '${sale.player}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${mainArray[1]} DAY)), '${mainArray[0]}', '${command}')`
            }

            try {
              await con.query(sale.commands);
              let serverFind = serversInfos.find(server => server.serverNumber == command)
              serverFind == undefined ? serversInfos.forEach(servers => {
                ReloadRolesAndTags(servers.identifier)
              }) : ReloadRolesAndTags(serverFind.identifier)


            } catch (ex) {
              console.log(ex)
              return sale.id
            }
          })

        }


      } else {
        msg.push(
          { name: `Resgatado ${cont}`, value: 'nao', inline: true }
        )
      }


    })

    webhook.debug(null, msg);

  } else {
    webhook.debug(
      `O pedido ${sale.id} não possui comandos para serem executados (${type})`
    );
  }
}

function toSteamID(steamHex) {
  let v = 76561197960265728n,
    w = BigInt('0x' + steamHex),
    y = w % 2n;

  w = w - y - v;

  if (w < 1) {
    return false;
  }
  return "STEAM_0:" + y + ":" + (w / 2n).toString();
}

async function asyncOnlineFilter(sales) {
  if (sales.erro) {
    console.log(sales.erro)
    return [];
  } else {
    return sales.filter((e) => e != null);
  }
}
