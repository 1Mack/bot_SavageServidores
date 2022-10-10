const { query } = require('gamedig');
const { host } = require('../../configs/config_geral')
const { EmbedBuilder } = require('discord.js')

exports.ServerStatus = async function (client) {

  let Catch = [];

  for (let i in host) {
    await query({
      type: 'csgo',
      host: '131.196.196.197',
      port: host[i].port,
      maxAttempts: 7
    })
      .then((state) => {

        Catch[i] = {
          name: state.name,
          mapa: state.map,
          players: state.raw.numplayers,
          playersTotal: state.maxplayers,
          ip: state.connect,
        };
      })
      .catch((error) => {
        Catch[i] = { name: 'off', mapa: 'off', players: 0, playersTotal: 0, ip: 'off' };
      });
  }



  let CatchFormat = Catch.map((m, i) => {
    return `***${m.name.slice(0, m.name.indexOf('|'))}*** \n\n**Mapa:** ${m.mapa}\n**Players:** ${m.players}/${m.playersTotal}\n**IP:** steam://connect/${m.ip}${i + 1 == Catch.length ? '' : '\n▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂\n\n'}`
  })



  let embedImg = new EmbedBuilder()
    .setColor('36393f')
    .setImage('https://cdn.discordapp.com/attachments/814295769699713047/877679866219233350/ip-dos-servidores.gif')

  let embed = new EmbedBuilder()
    .setColor('36393f')
    .setDescription(CatchFormat.join('').toString())
    .setFooter({ text: 'A lista atualizada a cada 5 min' })
    .setTimestamp()

  let cont = 0, contTotal = 0

  for (let i in Catch) {
    cont += Catch[i].players
    contTotal += Catch[i].playersTotal
  }
  let EmbedPlayersTotal = new EmbedBuilder()
    .setColor('#5F40C1')
    .setTitle('Players Online')
    .setTimestamp()
    .setDescription(`\`\`\`${cont}/${contTotal}\`\`\``)

  client.channels.cache.get('825124273655250984').send({ embeds: [EmbedPlayersTotal] })

  return [embedImg, embed]
}
