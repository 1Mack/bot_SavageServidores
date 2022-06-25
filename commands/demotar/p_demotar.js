const { MessageEmbed } = require('discord.js')
const { connection2 } = require('../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

const {
    MackNotTarget,
    SteamidNotFound,
    DemotedLog,
    DemotedSendMSG,
    DemotedAskConfirm,
    DemotedInfo,
} = require('./embed');
const { InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');
module.exports = {
    name: 'demotar',
    description: 'Demotar algéum do servidor',
    options: [
        { name: 'steamid', type: 3, description: 'steamid do player', required: true, choices: null },
        { name: 'motivo', type: 3, description: 'Motivo do Demoted', required: true, choices: null }
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '831219575588388915', type: 1, permission: true }], //Perm Set
    async execute(client, interaction) {
        let steamid = interaction.options.getString('steamid'),
            extra = interaction.options.getString('motivo');

        await interaction.deferReply()

        if (steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('STEAM_0', 'STEAM_1');
        }

        if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
            return interaction.followUp({ embeds: [MackNotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));


        const con = connection2.promise();
        let rows
        try {
            [rows] = await con.query(
                `select * from Cargos where playerid regexp '${steamid.slice(8)}'`
            );

        } catch (error) {
            return (
                interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        if (rows == '') {
            return interaction.followUp({ embeds: [SteamidNotFound(interaction, steamid)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }

        let serversInfosFound = rows.map(row => {
            let serverFind = serversInfos.find(m => m.serverNumber == row.server_id)

            let cargo = Object.keys(serverGroups).find(key => serverGroups[key].value === row.flags)

            return { row, serverFind, cargo }
        })
        const discordUser = rows.find(dc => dc.discordID != null)

        let msgFunction;
        //console.log(serversInfosFound)
        msgFunction = DemotedInfo(serversInfosFound, steamid)

        let msg = await interaction.followUp({ embeds: [msgFunction.embed], components: [msgFunction.selectMenu] })


        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        await interaction.channel.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
            .then(async ({ values }) => {

                values = await values.map(value => value.substring(0, value.indexOf('_')))

                serversInfosFound = serversInfosFound.filter(info => {
                    if (info['serverFind']) {
                        return values.includes(info.serverFind.serverNumber.toString())
                    } else return values.includes(info.row.server_id.toString())

                })

                msgFunction = DemotedAskConfirm(interaction)


                await msg.edit({ embeds: [msgFunction.embed], components: [msgFunction.button] })

                await interaction.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000 })
                    .then(async ({ customId }) => {

                        if (customId == 'nao') {

                            return (
                                msg.edit({ content: '**Abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
                                await wait(3000),
                                msg.delete()
                            )
                        } else {

                            try {
                                await con.query(
                                    `DELETE FROM Cargos WHERE playerid regexp '${steamid.slice(8)}' and 
                                     (${serversInfosFound.map(server =>
                                        `server_id = '${server.serverFind ? server.serverFind.serverNumber : server.row.server_id}' and flags = '${serverGroups[server.cargo].value}'`
                                    ).join(' or ')})
                                     `
                                );
                            } catch (error) {
                                return (
                                    msg.edit({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => msg.delete(), 10000)),
                                    console.error(chalk.redBright('Erro no Delete'), error)
                                );
                            }
                            let fetchedUser;

                            if (discordUser != '') {
                                fetchedUser = await interaction.guild.members.cache.get(discordUser.discordID);
                            }

                            serversInfosFound.forEach(async item => {

                                if (item.cargo != 'vip') {

                                    const DemotedMsgAll = new MessageEmbed()
                                        .setColor('ff0000')
                                        .setTitle('***Staff Demotado***')
                                        .addFields(
                                            { name: 'Jogador', value: fetchedUser ? fetchedUser.user.toString() : 'Indefinido' },
                                            { name: 'Cargo', value: item.cargo.toUpperCase() },
                                            { name: 'Servidor', value: item.serverFind ? item.serverFind.name.toUpperCase() : 'Desconhecido' }
                                        )
                                        .setFooter({ text: `Demotado pelo ${interaction.user.username}` })
                                        .setTimestamp();

                                    client.channels.cache.get('710288627103563837').send({ embeds: [DemotedMsgAll] })
                                }

                                client.guilds.cache.get(guildsInfo.log).channels.cache.get('792576104681570324').send({ embeds: [DemotedLog(fetchedUser ? fetchedUser.user : 'Indefinido', item.row.playerid, extra, interaction, item.serverFind ? item.serverFind.name : 'Desconhecido ou TODOS')] });


                            })


                            await msg.edit({ content: `**${interaction.user} | ${fetchedUser ? fetchedUser.user : steamid} Demotado com sucesso ${serversInfosFound.size > 1 ? 'dos servidores' : 'do servidor'} ${serversInfosFound.map(m => m.serverFind ? m.serverFind.visualName : 'desconhecido')}!!**`, embeds: [], components: [] })

                            setTimeout(() => {
                                msg.delete()
                            }, 5000);

                            if (fetchedUser) {

                                fetchedUser.send({ embeds: [DemotedSendMSG(fetchedUser ? fetchedUser.user : 'Indefinido', item.row.playerid, item.serverFind ? item.serverFind.name : 'desconhecido', extra)] }).catch(() => { })

                                /*  let findStaffRoles = await rows.filter(m => m.flags != 'a/t' && values.includes(m.server_id)).map(m => m.server_id),
                                     rolesToRemove = []
 
                                 if (findStaffRoles.length) {
                                     let staffRoles = serversInfosFound.filter(m => findStaffRoles.includes(m.serverNumber)).flatMap(m => [m.tagComprado, m.tagDoCargo]),
                                         staffAllRoles = fetchedUser._roles.filter(m => serversInfos.flatMap(f => [f.tagComprado, f.tagDoCargo]).includes(m))
 
                                     if (staffAllRoles.length == 1 && staffAllRoles.find(m => staffRoles.includes(m))) {
 
                                         rolesToRemove.push(staffRoles, '722814929056563260')
 
                                         if (fetchedUser.nickname.includes('Savage')) {
                                             fetchedUser.setNickname(fetchedUser.user.username).catch(() => { });
                                         }
 
                                     } else {
 
                                         rolesToRemove.push(staffRoles)
                                     }
                                 }
 
                                 await fetchedUser.roles.remove(rolesToRemove.flatMap(m => m)) */
                            }


                        }

                    }).catch(async () => {
                        return (
                            msg.edit({ content: '**Não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
                            await wait(4000),
                            msg.delete()
                        )
                    })
            }).catch(async () => {
                return (
                    msg.edit({ content: '**Não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
                    await wait(4000),
                    msg.delete()
                )
            })



    },
};
