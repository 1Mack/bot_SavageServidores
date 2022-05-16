const { guildsInfo } = require("../../configs/config_geral")


exports.CheckMemberCount = async function (client) {

    const guild = await client.guilds.cache.get(guildsInfo.main)
    const channel = guild.channels.cache.get('951490853434716230')
    const fontNumbers = ['𝟬', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵']

    let members = guild.memberCount.toString()

    members = members.split('')

    for (let i in members) {
        members[i] = fontNumbers[members[i]]
    }

    members = members.join('')


    if (!channel.name.includes(members)) {
        channel.setName(`👤┃𝗠𝗘𝗠𝗕𝗥𝗢𝗦: ${members}`)
    }

}
