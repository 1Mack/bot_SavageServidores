
const { panelApiKey, connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const fetch = require('node-fetch');
const {
    MackNotTarget,
    SteamidNotFound,
    PlayerDiscordRoleNotFound,
    DemotedLog,
    DemotedSendMSG,
    DemotedAskConfirm,
} = require('./embed');
const { InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');
module.exports = {
    name: 'demotar',
    description: 'Demotar algéum do servidor',
    options: [{ name: 'steamid', type: 3, description: 'steamid do Player', required: true, choices: null },
    { name: 'servidor', type: 3, description: 'Escolher um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
    { name: 'motivo', type: 3, description: 'Motivo do Demoted', required: true, choices: null }],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '831219575588388915', type: 1, permission: true }], //Perm Set
    async execute(client, interaction) {
        let steamid = interaction.options.getString('steamid'),
            servidor = interaction.options.getString('servidor'),
            extra = interaction.options.getString('motivo');
        await interaction.deferReply()

        if (steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
            return interaction.followUp({ embeds: [MackNotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);


        let guild = client.guilds.cache.get('792575394271592458');
        const canal = guild.channels.cache.find((channel) => channel.id === '792576104681570324');
        let rows, opa, rows2;
        const con = connection.promise();



        try {
            [rows] = await con.query(
                `select name, steamid, server_id, cargo, discord_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
            );
        } catch (error) {
            return (
                interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        if (rows == '') {
            return interaction.followUp({ embeds: [SteamidNotFound(interaction, servidor)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }

        await interaction.followUp({ embeds: [DemotedAskConfirm(interaction, rows)] })
            .then(async (m) => {


                let filter = (m) => m.author.id === interaction.user.id && ['s', 'sim', 'n', 'nao'].includes(m.content.toLowerCase());

                await interaction.channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 15000,
                        errors: ['time'],
                    })
                    .then(async (collected) => {
                        collected = collected.first()

                        collected.delete()

                        if (collected.content.toUpperCase() == 'NAO' || collected.content.toUpperCase() == 'N') {
                            return (opa = interaction.editReply({ content: '**Abortando Comando** <a:savage_loading:837104765338910730>', embeds: [] })
                                .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                        } else if (collected.content.toUpperCase() == 'SIM' || collected.content.toUpperCase() == 'S') {
                            return (opa = 's');
                        }
                    })
                    .catch((err) => {
                        return (opa = interaction.editReply({ content: '**Você não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>' })
                            .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                    });
            });

        if (opa != 's') return opa;

        try {
            await con.query(
                `DELETE FROM vip_sets 
        WHERE steamid='${steamid}' AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } catch (error) {
            return (
                interaction.editReply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                console.error(chalk.redBright('Erro no Delete'), error)
            );
        }
        let fetchedUser
        try {
            fetchedUser = await interaction.guild.members.cache.get(rows[0].discord_id);
        } catch (error) {
            let msg = await interaction.followUp({ embeds: [PlayerDiscordRoleNotFound(interaction)] })
            setTimeout(() => msg.delete(), 10000);
        }
        try {
            [rows2] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } catch (error) {
            return (
                interaction.editReply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        let setInfos = rows2.map((item) => {
            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${item.isVip == 1
                ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
                : `(${item.discord_id})`
                })`;
        });

        setInfos = setInfos.join('\n');

        for (let j in serversInfosFound.identifier) {
            try {
                await fetch(
                    `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                            Accept: 'application/json',
                            Authorization: `Bearer ${panelApiKey.api}`,
                        },
                        body: setInfos,
                    }
                );
            } catch (error) {
                return (
                    interaction.editReply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                    console.error(chalk.redBright('Erro no Admins_Simple'), error)
                );
            }

            try {
                fetch(`https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/command`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${panelApiKey.api}`,
                    },
                    body: JSON.stringify({ command: 'sm_reloadadmins' }),
                });
            } catch { }
        }
        if (fetchedUser != undefined) {

            let staffRoles = serversInfos.flatMap(m => [m.tagComprado, m.tagDoCargo]),
                vipRoles = serversInfos.map(m => m.tagVip)

            staffRoles = fetchedUser._roles.filter(m => staffRoles.includes(m))
            vipRoles = fetchedUser._roles.filter(m => vipRoles.includes(m))

            if (rows[0].cargo.includes('vip')) {
                if (vipRoles.length > 1) {
                    await fetchedUser.roles.remove(serversInfosFound.tagVip);
                } else {

                    fetchedUser.roles.remove([serversInfosFound.tagVip, '753728995849142364']);

                    if (fetchedUser.nickname) {
                        if (fetchedUser.nickname.includes('VIP | ')) {

                            fetchedUser.setNickname(fetchedUser.user.username).catch(() => { })
                        }
                    }
                }
            } else if (staffRoles.length > 1) {
                fetchedUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]).catch(() => { })
            } else {
                fetchedUser.roles.remove([
                    serversInfosFound.tagDoCargo,
                    '722814929056563260',
                    serversInfosFound.tagComprado,
                ]).catch(() => { })

                fetchedUser.setNickname(fetchedUser.user.username).catch(() => { });
            }
        }

        canal.send({ embeds: [DemotedLog(rows[0], steamid, extra, interaction)] });

        fetchedUser.send({ embeds: [DemotedSendMSG(fetchedUser.user, steamid, servidor, extra)] }).catch(() => { })


        interaction.editReply({ content: `**${interaction.user} | ${fetchedUser.user.username} Demotado com sucesso!!**`, embeds: [], ephemeral: true })
    },
};
