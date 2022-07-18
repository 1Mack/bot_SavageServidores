const { connection } = require('../../../configs/config_privateInfos');
const { BanSucess, Banlog, BanError, MackNotTarget } = require('./embed');
const chalk = require('chalk');

exports.BanirTemp = async function (client, interaction, nick, steamid, tempo, reason, userDiscord) {

  if (!interaction.member.roles.cache.has('778273624305696818')) return interaction.reply({ content: 'voce nao pode usar esse comando', ephemeral: true })

  if (steamid.startsWith('STEAM_0')) {
    steamid = steamid.replace('0', '1');
  }

  if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
    return interaction.followUp({ embeds: [MackNotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));


  let timeNow = Date.now();
  timeNow = Math.floor(timeNow / 1000);
  let timeEnd = timeNow + tempo * 60;

  const con = connection.promise();
  let result
  try {
    [result] = (await con.query(`SELECT auth, ip from firstjoin where auth = '${steamid}'`))[0]
  } catch (error) { }

  if (result == '' || result == undefined) {
    result = [{ ip: null }]
  }

  try {
    let sqlBans = 'INSERT INTO sb_bans (ip, authid, name, created, ends, length, reason, aid, sid, country, type) VALUES ?',
      SqlBan_VALUES = [[`${result.ip}`, `${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, null, 0]];

    await con.query(sqlBans, [SqlBan_VALUES]);

    client.channels.cache.get('721854111741509744').send({ embeds: [Banlog(nick, steamid, tempo, reason, interaction.user)] });
    await interaction.reply({ embeds: [BanSucess(interaction.user, nick, steamid)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
  } catch (error) {
    interaction.channel.send({ embeds: [BanError(interaction.user)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    console.error(chalk.redBright('Erro no Banimento'), error);
  }
};
