const { connection } = require('../../../configs/config_privateInfos');
const { MackNotTarget, CommError, CommSucess, Commlog } = require('./embed');
const chalk = require('chalk');

exports.MutarTemp = async function (client, interaction, nick, steamid, tempo, reason, tipo) {

  if (steamid['error']) return interaction.reply({ content: steamid.erro, ephemeral: true })

  if (steamid.startsWith('STEAM_0')) {
    steamid = steamid.replace('0', '1');
  }

  if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
    return interaction.followUp({ embeds: [MackNotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));


  let timeNow = Date.now();
  timeNow = Math.floor(timeNow / 1000);
  let timeEnd = timeNow + tempo * 60;
  tempo *= 60

  const con = connection.promise();

  try {
    let sqlComms = 'INSERT INTO sb_comms(authid, name, created, ends, length, reason, aid, sid, type) VALUES ?',
      SqlComm_VALUES = [[`${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, tipo]];

    await con.query(sqlComms, [SqlComm_VALUES]);


  } catch (error) {
    interaction.reply({ embeds: [CommError(interaction.user)], ephemeral: true }).then(() => setTimeout(() => interaction.webhook.deleteMessage('@original'), 10000));
    return console.error(chalk.redBright('Erro no Mute'), error);
  }

  interaction.guild.channels.cache.get('721854167160848454').send({ embeds: [Commlog(nick, steamid, tempo, reason, tipo, interaction.user)] });
  await interaction.reply({ embeds: [CommSucess(interaction.user, nick, steamid, tipo)] }).then(() => setTimeout(() => interaction.deleteReply(), 5000));
};
