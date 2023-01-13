const { guildsInfo } = require("../../configs/config_geral")
const axios = require('axios');
const convert = require('xml-js');

exports.CheckMemberCount = async function (client) {

  const guild = await client.guilds.cache.get(guildsInfo.main)
  const fontNumbers = ['𝟬', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵']

  function ChangeChannelName(members, channel, channelName) {

    members = members.split('')

    for (let i in members) {
      members[i] = fontNumbers[members[i]]
    }

    members = members.join('')


    if (!channel.name.includes(members)) {
      channel.setName(`👤┃${channelName}: ${members}`)
    }
  }

  ChangeChannelName(guild.memberCount.toString(), guild.channels.cache.get('951490853434716230'), '𝗗𝗜𝗦𝗖𝗢𝗥𝗗')


  try {

    axios.get('https://steamcommunity.com/groups/SavageServidores/memberslistxml?xml=1').then(({ data }) => {
      let steamGroup = convert.xml2js(data, { compact: true, spaces: 4, })

      ChangeChannelName(steamGroup.memberList.groupDetails.memberCount._text, guild.channels.cache.get('1051110679446306886'), '𝗦𝗧𝗘𝗔𝗠')
    })

  } catch (error) { }


}
