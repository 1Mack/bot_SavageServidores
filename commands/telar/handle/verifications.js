const { default: axios } = require("axios");
const SteamID = require("steamid");

exports.Verification = async function (info) {

  if ((!info.includes('steamcommunity.com/id/') && !info.includes('steamcommunity.com/profiles/')) || !info.includes('http'))
    return 'Link Incorreto'

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
  } catch (error) { return 'Erro ao pegar a STEAMID' }

  if (steamid64 == undefined) steamid64 = info

  return new SteamID(steamid64).getSteam2RenderedID(true)

}