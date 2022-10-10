const { default: axios } = require("axios");
const SteamID = require("steamid");
const { serversInfos } = require("../../../configs/config_geral");

exports.Verification = async function (interaction, info) {

  if (info.includes('http') || info.includes('STEAM')) {
    if (info.startsWith('STEAM')) return info

    if (
      ['steamcommunity.com/id/', 'steamcommunity.com/profiles/'].includes(info) &&
      ['https', 'http'].includes(info)

    )
      return undefined

    if (info.charAt(info.length - 1) == '/') {
      info = info.slice(0, -1);
    }
    info = info.slice(info.lastIndexOf('/') + 1)

    let steamid64;
    try {
      steamid64 = await axios.get(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&vanityurl=${info}`
      ).then(async ({ data }) => {

        return data.response['steamid'];
      });
    } catch (error) {}

    if (steamid64 == undefined) return undefined

    return new SteamID(steamid64).getSteam2RenderedID(true)
  } else {
    return serversInfos.find(sv => sv.name.includes(info.toLowerCase()))
  }
}