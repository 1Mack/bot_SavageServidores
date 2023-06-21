const SteamID = require('steamid');
const { steamApiKey } = require('../../configs/config_privateInfos');
const axios = require('axios').default
exports.getSteamid = async function (steamURL) {

  if (
    ['steamcommunity.com/id/', 'steamcommunity.com/profiles/'].includes(steamURL) &&
    ['https', 'http'].includes(steamURL)

  )
    return {
      steamURL,
      erro: `😫 **|** ${interaction.user} Você digitou o link do seu perfil errado!!\n\n Formato correto do link: https://steamcommunity.com/id/1MaaaaaacK/ ou https://steamcommunity.com/profiles/76561198119188837`
    }




  if (steamURL.charAt(steamURL.length - 1) == '/') {
    steamURL = steamURL.slice(0, -1);
  }
  steamURL = steamURL.slice(steamURL.lastIndexOf('/') + 1)

  let steamid64;
  try {
    steamid64 = await axios.get(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamApiKey}&vanityurl=${steamURL}`
    ).then(async ({ data }) => {
      if (data.response['message']) throw Error('erro')

      return data.response.steamid;
    });
  } catch (error) {

    return { steamURL, erro: 'Erro no link' }
  }
  if (!steamid64 || steamid64['erro']) {
    if (steamid64['erro']) return steamid64
    steamid64 = steamURL;
  }
  return new SteamID(steamid64).getSteam2RenderedID(true).toString()
}