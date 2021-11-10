const SteamID = require('steamid');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const { PerfilInfoGenerating, PerfilWrong } = require('./embed');
module.exports = {
    name: 'perfil',
    description: 'Ver informações do seu perfil da steam',
    options: [{name: 'steam_url', type: 3, description: 'Link do seu perfil da steam → Exemplo: https://steamcommunity.com/id/1MaaaaaacK/', required: true, choices: null}],
    default_permission: true,
    cooldown: 10,
    permissions: [],
    async execute(client, interaction) {
        let steamURL = interaction.options.getString('steam_url')

        if (
            steamURL.includes('https://steamcommunity.com/id/') == false &&
            steamURL.includes('https://steamcommunity.com/profiles/') == false
        )
            return interaction.reply({content:
                `😫 **|** ${interaction.user} Você digitou o link do seu perfil errado!!\n\n Formato correto do link: https://steamcommunity.com/id/1MaaaaaacK/ ou https://steamcommunity.com/profiles/76561198119188837`
                })
                .then(() => setTimeout(() => interaction.deleteReply(), 10000));

        if (steamURL.slice(-1) == '/') {
            steamURL = steamURL.slice(0, -1);
        }
        if (steamURL.includes('https://steamcommunity.com/profiles/')) {
            steamURL = steamURL.slice(36);
        } else {
            steamURL = steamURL.slice(30);
        }
        let steamid64;
        try {
            steamid64 = await fetch(
                `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&vanityurl=${steamURL}`
            ).then(async (m) => {
                m = await m.json();
                return m.response.steamid;
            });
        } catch (error) {
            return interaction.reply({content: 'Erro no link'});
        }

        if (steamid64 == undefined) {
            steamid64 = steamURL;
        }

        await interaction.reply({embeds: [PerfilInfoGenerating(interaction)]});

        let PerfilInfos;
        try {
            PerfilInfos = {
                amigos: await fetch(
                    `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}`
                )
                    .then(async (res) => {
                        res = await res.json();

                        return res.friendslist == undefined ? 'Privado' : res.friendslist.friends.length;
                    })
                    .catch((error) => {
                        return interaction.editReply({embeds: [PerfilWrong(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 8000));
                    }),
                bans: await fetch(
                    `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamids=${steamid64}`
                )
                    .then(async (m) => {
                        m = await m.json();
                        return m.players;
                    })
                    .catch(() => {}),
                playerInfos: await fetch(
                    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=1EF908743086093E1FB911BC9BF2CCE8&steamids=${steamid64}`
                )
                    .then(async (m) => {
                        m = await m.json();
                        return m.response.players;
                    })
                    .catch(() => {}),
                jogos_totais: await fetch(
                    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}&include_appinfo=false&include_played_free_games=true`
                )
                    .then(async (m) => {
                        m = await m.json();
                        return m.response.game_count == undefined ? 'Privado' : m.response.game_count;
                    })
                    .catch(() => {}),
                steam_lvl: await fetch(
                    `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&steamid=${steamid64}`
                )
                    .then(async (m) => {
                        m = await m.json();
                        return m.response.player_level == undefined ? 'Privado' : m.response.player_level;
                    })
                    .catch(() => {}),
                steamid: new SteamID(steamid64).getSteam2RenderedID(true),
            };
            const embed = new Discord.MessageEmbed()
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
                    {
                        name: 'Level da Steam',
                        value: PerfilInfos.steam_lvl.toString(),
                        inline: true,
                    },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Total de Amigos', value: PerfilInfos.amigos.toString(), inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    {
                        name: 'Conta Criada dia',
                        value: new Date(PerfilInfos.playerInfos[0].timecreated * 1000).toLocaleDateString('en-GB'),
                        inline: true,
                    }
                );

            interaction.editReply({embeds: [embed]});
        } catch (error) {}
    },
};
