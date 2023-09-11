const { EmbedBuilder } = require("discord.js");
const { guildsInfo } = require("../../configs/config_geral");
const { connection } = require("../../configs/config_privateInfos");

exports.CommandHandler = class {
  constructor(client) {
    this.con = connection.promise()
    this.guild = client.guilds.cache.get(guildsInfo.main)
  }
  async removeBan(idOrSteam, motivo, discordID, local) {
    let timeNow = Math.floor(Date.now() / 1000)
    let rows;
    try {

      if (!idOrSteam) throw new Error('Você deve fornecer o id ou a steamid')

      rows = (await this.con.query(
        `SELECT bid, ip, authid FROM sb_bans WHERE ${idOrSteam.includes('STEAM') ? `authid REGEXP "${idOrSteam.slice(8)}" ` : `bid=${idOrSteam}`} AND RemovedOn IS NULL ORDER BY created DESC LIMIT 1`
      ))[0][0]

      if (!rows) throw new Error('Nenhum banimento foi encontrado')

      await this.con.query(
        `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid = ${rows.bid}`
      );

      let getIp = (await this.con.query(
        `SELECT bid, ip FROM sb_bans WHERE ip="${rows.ip}"`
      ))[0][0];

      if (!getIp) {
        await this.con.query(
          `UPDATE sb_bans SET ip ="" WHERE bid in(${getIp.map(m => `${m.bid}`)})`
        );
      }

    } catch (error) {
      console.error(error)
      return { error: error.message }
    }

    const embed = new EmbedBuilder()
      .setColor('#36393f')
      .setTitle(`**DESBAN**`)
      .addFields({ name: 'Steamid', value: rows.authid }, { name: 'Motivo', value: motivo })
      .setFooter({ text: `Desbanido via ${local}` });

    this.guild.channels.cache.get('721854111741509744').send({ embed: [embed] }).catch(() => { })

    let fetchedUser = await this.guild.members.cache.get(discordID);
    if (!fetchedUser) fetchedUser = await this.guild.members.fetch(discordID)

    if (fetchedUser) {
      try {
        await fetchedUser.roles.remove('818865070497988668')
        await fetchedUser.roles.add('924729364032155739')
      } catch (error) { }

    }
    return 'Desbanido'
  }
  async removeMute(idOrSteam, motivo) {
    let timeNow = Math.floor(Date.now() / 1000)

    if (!idOrSteam) throw new Error('Você deve fornecer o id ou a steamid')
    try {
      let [rows] = await this.con.query(
        `SELECT bid FROM sb_comms WHERE ${idOrSteam.includes('STEAM') ? `authid REGEXP "${idOrSteam.slice(8)}" ` : `bid=${idOrSteam}`} AND RemovedOn IS NULL ORDER BY created DESC LIMIT 1`
      );
      if (!rows) throw new Error('Nenhum mute foi encontrado')

      await this.con.query(
        `UPDATE sb_comms SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE bid = ${rows[0].bid}`
      );
    } catch (error) {
      console.error(error)
      return { error: error.message }
    }
    return 'Desmutado'
  }
  async ban(nick, steamid, tempo, reason,) {
    let timeNow = Date.now();
    timeNow = Math.floor(timeNow / 1000);
    let timeEnd = timeNow + tempo * 60;

    let result
    try {
      [result] = (await this.con.query(`SELECT auth, ip from firstjoin where auth = '${steamid.slice(8)}'`))[0]
    } catch (error) {
      return { error: error.message }
    }

    if (result == '' || result == undefined) {
      result = [{ ip: null }]
    }
    try {
      let sqlBans = 'INSERT INTO sb_bans (ip, authid, name, created, ends, length, reason, aid, sid, type) VALUES ?',
        SqlBan_VALUES = [[`${result.ip}`, `${steamid.replace('STEAM_0', 'STEAM_1')}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, 0]];

      await this.con.query(sqlBans, [SqlBan_VALUES]);

    } catch (error) {
      return { error: error.message }
    }

    return true

  }
}