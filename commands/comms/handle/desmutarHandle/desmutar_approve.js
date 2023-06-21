const { connection } = require('../../../../configs/config_privateInfos');
const { UnCommsLog, PlayerNotFound } = require('../embed');
const { InternalServerError } = require('../../../../embed/geral');
const chalk = require('chalk');


exports.Desmutar_approve = async function (client, interaction, steamid, motivo, tipo, id) {

  const unmuteLog = UnCommsLog(steamid, motivo, interaction, tipo == 1 ? 'MUTE' : 'GAG')

  let timeNow = Math.floor(Date.now() / 1000)

  const con = connection.promise();
  let rows

  if (interaction.guild.id === '343532544559546368') {
    try {
      let [rows] = await con.query(
        `SELECT bid FROM sb_comms WHERE bid=${id} AND RemovedOn IS NULL`
      );

      if (rows == '') {
        return interaction.reply({ embeds: [PlayerNotFound(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      }
      await con.query(
        `UPDATE sb_comms SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid = ${id}`
      );

    } catch (error) {
      interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
      return console.error(chalk.redBright('Erro no Desmutar'), error);
    }

    interaction.guild.channels.cache.get('721854167160848454').send({ embeds: [unmuteLog.embed] })

    interaction.reply({ embeds: [unmuteLog.embed] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));

  } else {
    try {
      [rows] = await con.query(
        `SELECT bid FROM sb_comms WHERE bid=${id} AND RemovedOn IS NULL`
      );

      if (rows == '') return 'já desmutado'


      await con.query(
        `UPDATE sb_comms SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid=${id}`
      );

      client.guilds.cache.get('343532544559546368').channels.cache.get('721854167160848454').send({ embeds: [unmuteLog.embed] })

    } catch (error) {
      return 'erro'
    }

  }

  return 'desmutado'
} 