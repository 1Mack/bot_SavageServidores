const { connection, panelApiKey } = require('../../../configs/config_privateInfos');
const { DesbanLog, PlayerNotFound } = require('./embed');
const axios = require('axios').default
const { serversInfos } = require('../../../configs/config_geral');
const { InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');

exports.Desbanir = async function (client, interaction, steamid, motivo) {

  if (!interaction.member.roles.cache.has('778273624305696818'))
    return interaction.reply({ content: 'voce nao pode usar esse comando', ephemeral: true }).then(() => setTimeout(() => {
      interaction.webhook.deleteMessage('@original')
    }, 5000))

  let timeNow = Date.now();
  timeNow = Math.floor(timeNow / 1000);

  const con = connection.promise();

  try {
    let [rows] = await con.query(
      `SELECT authid, RemoveType from sb_bans WHERE authid regexp "${steamid.slice(8)}" AND RemovedOn is null`
    );

    if (rows == '') {
      return interaction.reply({ embeds: [PlayerNotFound(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
    }
    await con.query(
      `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE authid regexp "${steamid.slice(8)}"`
    );
    client.channels.cache.get('721854111741509744').send({ embeds: [DesbanLog(steamid, motivo, interaction)] });
    interaction.reply({ embeds: [DesbanLog(steamid, motivo, interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
  } catch (error) {
    interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
    console.error(chalk.redBright('Erro no Desbanir'), error);
  }

  serversInfos.forEach(m => {
    m.identifier.forEach(id => {
      axios.post(`https://panel.mjsv.us/api/client/servers/${id}/command`,
        JSON.stringify({ command: `removeid STEAM_1:${steamid.slice(8)}` }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        }).catch(() => { })

      axios.post(`https://panel.mjsv.us/api/client/servers/${id}/command`,
        JSON.stringify({ command: `removeid STEAM_0:${steamid.slice(8)}` }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        }).catch(() => { })
    })
  })

};
