const { connection2 } = require("../../configs/config_privateInfos");

const con = connection2.promise();

exports.CheckDatabaseRole = async function (steamid, serverID, isVipRole, flags, time, discordID) {
  if (isVipRole) {
    try {
      let [res] = await con.query(
        `SELECT id FROM Cargos 
                      WHERE playerid regexp '${steamid.slice(8)}' 
                      AND server_id = ${serverID} 
                      AND flags = '${flags}'`);
      if (res.length == 0) {
        await con.query(`
        INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
        VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${time == 0 ? '3850' : time} DAY)), '${flags}', ${serverID}, '${discordID ? discordID : ''}')
    `
        );
      } else {
        await con.query(
          `UPDATE Cargos SET 
                    ${discordID ? `discordID = '${discordID}',` : ''}
                    flags = '${flags}', 
                    enddate = (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${time == 0 ? '3850' : time} DAY))
                    WHERE id = ${res[0].id}`
        );
      }
    } catch (error) {
      throw new Error(error)
    }
  } else {
    try {
      let [res] = await con.query(
        `SELECT id FROM Cargos 
                      WHERE playerid regexp '${steamid.slice(8)}' 
                      AND server_id = ${serverID} 
                      AND (flags NOT REGEXP('t') OR flags regexp('a/b/c/d/f/g/h/i/j/k/l/m/n/s/o/p/t|a/b/c/d/f/g/h/i/j/k/m/s/o/t'))`);
      if (res.length == 0) {
        await con.query(`
        INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
        VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3650 DAY)), '${flags}', ${serverID}, '${discordID}')
    `
        );
      } else {
        await con.query(
          `UPDATE Cargos SET 
                    discordID = '${discordID}',
                    flags = '${flags}'
                    WHERE id = ${res[0].id}`
        );
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}