const SteamID = require("steamid")

exports.PastaID = async function (client, interaction, steamids) {
  steamids = steamids.replace(/\s/g, '').split(',')

  steamids = steamids.map(steamid => `${new SteamID(`[U:1:${steamid}]`).getSteam2RenderedID(true)} (${steamid})`)


  interaction.reply(steamids.join(', '))
}