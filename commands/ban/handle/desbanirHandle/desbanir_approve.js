const { connection, panelApiKey } = require('../../../../configs/config_privateInfos');
const { DesbanLog, PlayerNotFound } = require('../embed');
const axios = require('axios').default
const { serversInfos } = require('../../../../configs/config_geral');
const { InternalServerError } = require('../../../../embed/geral');
const chalk = require('chalk');


exports.Desbanir_approve = async function (client, interaction, steamid, motivo, id) {

  const desbanLog = DesbanLog(steamid, motivo, interaction)

  let timeNow = Math.floor(Date.now() / 1000)

  const con = connection.promise();
  let rows

  if (interaction.guild.id === '343532544559546368') {
    try {
      let [rows] = await con.query(
        `SELECT bid FROM sb_bans WHERE ${id ? `bid=${id}` : `authid REGEXP "${steamid.slice(8)}" `} AND RemovedOn IS NULL`
      );

      if (rows == '') {
        return interaction.reply({ embeds: [PlayerNotFound(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      }
      await con.query(
        `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid = ${rows[0].bid}`
      );

    } catch (error) {
      interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      return console.error(chalk.redBright('Erro no Desbanir'), error);
    }


    interaction.guild.channels.cache.get('721854111741509744').send({ embeds: [desbanLog.embed] })

    return interaction.reply({ embeds: [desbanLog.embed] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));


  } else {
    try {
      [rows] = await con.query(
        `SELECT bid FROM sb_bans WHERE bid=${rows[0].bid} AND RemovedOn IS NULL`
      );

      if (rows == '') return 'já desbanido'

      await con.query(
        `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid=${rows[0].bid}`
      );

      client.guilds.cache.get('343532544559546368').channels.cache.get('721854111741509744').send({ embeds: [desbanLog.embed] })


    } catch (error) {
      return 'erro'
    }
  }






  return 'desbanido'
} 