const { guildsInfo } = require("../../configs/config_geral")
const axios = require('axios');
const convert = require('xml-js');
const { connection } = require("../../configs/config_privateInfos");

exports.CheckMemberCount = async function (client) {

  const guild = await client.guilds.cache.get(guildsInfo.main)
  const fontNumbers = ['𝟬', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵']

  function ChangeChannelName(members, channel, channelName) {

    members = members.toString().split('')

    for (let i in members) {
      members[i] = fontNumbers[members[i]]
    }

    members = members.join('')

    if (!channel.name.includes(members)) {
      channel.setName(`${channelName}: ${members}`)
    }
  }

  ChangeChannelName(guild.memberCount.toString(), guild.channels.cache.get('951490853434716230'), '👤┃𝗗𝗜𝗦𝗖𝗢𝗥𝗗')
  try {
    const con = connection.promise()
    const [row] = (await con.query(`SELECT COUNT(bid) AS total FROM sb_bans WHERE length = 0 AND RemovedOn IS NULL`))[0]
    if(row) {
      ChangeChannelName(row.total, guild.channels.cache.get('1121078029117030561'), '🚫┃𝗕𝗔𝗡𝗜𝗗𝗢𝗦')
    }
  } catch (error) {console.log(error)}



  try {
    axios.get('https://steamcommunity.com/groups/SavageServidores/memberslistxml?xml=1').then(({ data }) => {
      let steamGroup = convert.xml2js(data, { compact: true, spaces: 4, })
  
      ChangeChannelName(steamGroup.memberList.groupDetails.memberCount._text, guild.channels.cache.get('1051110679446306886'), '👤┃𝗦𝗧𝗘𝗔𝗠')
    })
  } catch (error) {console.log(error)}



}
