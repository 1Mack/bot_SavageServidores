const axios = require('axios').default
const { EmbedBuilder } = require('discord.js')

exports.ServerStatus = async function (client) {

  return axios.get('http://131.196.196.194:22500/servers').then(({ data }) => {

    const newData = data.flatMap(m => m.serversInfos).sort(function (a, b) { return a.name.split(' ', 3)[2].replace('#', '') - b.name.split(' ', 3)[2].replace('#', '') })

    let embedFormat = newData.map((m, i) => {
      return `***${m.name.slice(0, m.name.indexOf('|'))}*** \n\n**Mapa:** ${m.map}\n**Players:** ${m.players}/${m.playersTotal}\n**IP:** steam://connect/${m.ip}${i + 1 == newData.length ? '' : '\n▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂\n\n'}`
    })


    let embedImg = new EmbedBuilder()
      .setColor('36393f')
      .setImage('https://cdn.discordapp.com/attachments/814295769699713047/877679866219233350/ip-dos-servidores.gif')

    let embed = new EmbedBuilder()
      .setColor('36393f')
      .setDescription(embedFormat.join('').toString())
      .setFooter({ text: 'A lista atualizada a cada 1.5 min' })
      .setTimestamp()


    let cont = 0, contTotal = 0

    for (let i in newData) {
      cont += newData[i].players
      contTotal += newData[i].playersTotal
    }
    let EmbedPlayersTotal = new EmbedBuilder()
      .setColor('#5F40C1')
      .setTitle('Players Online')
      .setTimestamp()
      .setDescription(`\`\`\`${cont}/${contTotal}\`\`\``)



    client.channels.cache.get('825124273655250984').send({ embeds: [EmbedPlayersTotal] })

    return [embedImg, embed]
  }).catch((err) => {
    console.log(err)
    return [new EmbedBuilder()
      .setColor('36393f')
      .setDescription('Falha ao carregar a lista')
      .setFooter({ text: 'A lista atualizada a cada 1.5 min' })
      .setTimestamp()]

  })
}
