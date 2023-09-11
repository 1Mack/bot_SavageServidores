const { panelApiKey } = require('../../configs/config_privateInfos');

const axios = require('axios').default

exports.ReloadRolesAndTags = function (serverID) {
  typeof serverID == 'string' ? serverID = [serverID] : serverID
  serverID.forEach(async element => {

    try {
      await axios.post(`https://panel.mjsv.us/api/client/servers/${element}/command`,
        { "command": `sm_reloadadmins` },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        })
    } catch (error) { }
    try {
      await axios.post(`https://panel.mjsv.us/api/client/servers/${element}/command`,
        { "command": `sm_reloadtags` },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${panelApiKey.api}`,
          }
        })
    } catch (error) { }
  });

}