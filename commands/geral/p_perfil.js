const SteamID = require('steamid');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { PerfilInfoGenerating, PerfilWrong } = require('./embed');
const axios = require('axios').default
module.exports = {
  name: 'perfil',
  description: 'Ver informações do seu perfil da steam',
  options: [{ name: 'steam_url', type: ApplicationCommandOptionType.String, description: 'Link do seu perfil da steam → Exemplo: https://steamcommunity.com/id/1MaaaaaacK/', required: true, choices: null }],
  default_permission: true,
  cooldown: 10,
  async execute(client, interaction) {
    let steamURL = interaction.options.getString('steam_url')

    if (
      ['steamcommunity.com/id/', 'steamcommunity.com/profiles/'].includes(steamURL) &&
      ['https', 'http'].includes(steamURL)

    )
      return interaction.reply({
        content:
          `😫 **|** ${interaction.user} Você digitou o link do seu perfil errado!!\n\n Formato correto do link: https://steamcommunity.com/id/1MaaaaaacK/ ou https://steamcommunity.com/profiles/76561198119188837`
      })
        .then(() => setTimeout(() => interaction.deleteReply(), 10000));

    if (steamURL.charAt(steamURL.length - 1) == '/') {
      steamURL = steamURL.slice(0, -1);
    }
    steamURL = steamURL.slice(steamURL.lastIndexOf('/') + 1)

    let steamid64;
    try {
      steamid64 = await axios.get(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&vanityurl=${steamURL}`
      ).then(async ({ data }) => {
        return data.response.steamid;
      });
    } catch (error) {
      return interaction.reply({ content: 'Erro no link' });
    }

    if (steamid64 == undefined) {
      steamid64 = steamURL;
    }
    await interaction.reply({ embeds: [PerfilInfoGenerating(interaction)] });

    let PerfilInfos;
    try {
      PerfilInfos = {
        amigos: await axios.get(
          `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}`
        )
          .then(async ({ data }) => {

            return data.friendslist == undefined ? 'Privado' : data.friendslist.friends.length;
          })
          .catch((error) => {
            return 'Privado'
          }),
        bans: await axios.get(
          `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamids=${steamid64}`
        )
          .then(async ({ data }) => {
            return data.players;
          })
          .catch(() => { }),
        playerInfos: await axios.get(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=1EF908743086093E1FB911BC9BF2CCE8&steamids=${steamid64}`
        )
          .then(async ({ data }) => {
            return data.response.players;
          })
          .catch(() => { }),
        jogos_totais: await axios.get(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}&include_appinfo=false&include_played_free_games=true`
        )
          .then(async ({ data }) => {
            return data.response.game_count == undefined ? 'Privado' : data.response.game_count;
          })
          .catch(() => { }),
        /*  steam_lvl: await axios.get(
           `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}`
         )
           .then(async ({ data }) => {
             console.log(data)
             return data.response.player_level == undefined ? 'Privado' : data.response.player_level;
           })
           .catch((err) => { console.log(err) }), */
        steamid: new SteamID(steamid64).getSteam2RenderedID(true),
      };

      const embed = new EmbedBuilder()
        .setColor('36393f')
        .setThumbnail(PerfilInfos.playerInfos[0].avatarfull.toString())
        .setTitle(PerfilInfos.playerInfos[0].personaname.toString())
        .addFields(
          { name: 'Steamid', value: PerfilInfos.steamid.toString(), inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Vac', value: PerfilInfos.bans[0].VACBanned.toString(), inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: 'TradeBan', value: PerfilInfos.bans[0].EconomyBan.toString(), inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'CommunityBan', value: PerfilInfos.bans[0].CommunityBanned.toString(), inline: true },
          { name: '\u200B', value: '\u200B' },
          {
            name: 'Total de Jogos',
            value: PerfilInfos.jogos_totais.toString(),
            inline: true,
          },
          { name: '\u200B', value: '\u200B', inline: true },
          /*  {
             name: 'Level da Steam',
             value: PerfilInfos.steam_lvl.toString(),
             inline: true,
           }, */
          { name: '\u200B', value: '\u200B' },
          { name: 'Total de Amigos', value: PerfilInfos.amigos.toString(), inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          {
            name: 'Conta Criada dia',
            value: new Date(PerfilInfos.playerInfos[0].timecreated * 1000).toLocaleDateString('en-GB'),
            inline: true,
          }
        );

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      interaction.editReply({ embeds: [PerfilWrong(interaction)] }).then(() => setTimeout(() => {
        interaction.deleteReply()
      }, 5000))
    }
  },
};
