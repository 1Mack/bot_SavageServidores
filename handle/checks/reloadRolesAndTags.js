const { panelApiKey } = require('../../configs/config_privateInfos');

const axios = require('axios').default

exports.ReloadRolesAndTags = function (serverID) {

  serverID.forEach(async element => {
    await axios.post(`https://panel.mjsv.us/api/client/servers/${element}/command`,
      JSON.stringify({ command: `sm_reloadadmins` }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        }
      }).catch(() => { })
    await axios.post(`https://panel.mjsv.us/api/client/servers/${element}/command`,
      JSON.stringify({ command: `sm_reloadtags` }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${panelApiKey.api}`,
        }
      }).catch(() => { })
  });

}