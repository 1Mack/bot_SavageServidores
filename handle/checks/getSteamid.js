const SteamID = require('steamid');
const { steamApiKey } = require('../../configs/config_privateInfos');
const axios = require('axios').default
exports.GetSteamid = async function (steamURL) {
  if (steamURL.includes('STEAM_')) return steamURL
  if (!((steamURL.includes('steamcommunity.com/id/') || steamURL.includes('steamcommunity.com/profiles/')) &&
    (steamURL.includes('http') || steamURL.includes('https')))

  ) {
    if (!isNaN(steamURL) && steamURL > 10) {

      try {
        return new SteamID(steamURL).getSteam2RenderedID(true)
      } catch (error) {
        return {
          steamURL,
          error: `Erro no link`
        }
      }
    } else {

      return {
        steamURL,
        error: `😫 **|** Você digitou o link do seu perfil errado!!\n\n Formato correto do link: https://steamcommunity.com/id/1MaaaaaacK/ ou https://steamcommunity.com/profiles/76561198119188837`
      }
    }
  }




  if (steamURL.charAt(steamURL.length - 1) == '/') {
    steamURL = steamURL.slice(0, -1);
  }
  steamURL = steamURL.slice(steamURL.lastIndexOf('/') + 1)

  if (!isNaN(steamURL) && steamURL > 10) {

    try {
      return new SteamID(steamURL).getSteam2RenderedID(true)
    } catch (error) {
      return {
        steamURL,
        error: `Erro no link`
      }
    }
  }
  let steamid64;
  try {
    steamid64 = await axios.get(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamApiKey.api}&vanityurl=${steamURL}`
    ).then(async ({ data }) => {

      if (data.response['message']) throw Error('erro')

      return data.response.steamid;
    });
  } catch (error) {

    return { steamURL, error: 'Erro no link' }
  }
  if (!steamid64 || steamid64['erro']) {
    if (steamid64['erro']) return steamid64
    steamid64 = steamURL;
  }
  return new SteamID(steamid64).getSteam2RenderedID(true)
}