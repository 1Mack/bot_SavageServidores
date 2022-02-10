const fetch = require('node-fetch');
const { connection, panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const {
    AskQuestion,
    CheckDatabaseError,
    Top1NotFound,
    logVip,
    vipSendMSG,
    SetSuccess,
} = require('./embed');
const chalk = require('chalk');

const { InternalServerError } = require('../../embed/geral');
module.exports = {
    name: 'resetrank',
    description: 'Resetar Rank dos servidores',
    options: [],
    default_permission: false,
    cooldown: 15,
    permissions: [{ id: '603318536798077030', type: 1, permission: true }], //Fundador
    async execute(client, interaction) {
        await interaction.reply({ embeds: [AskQuestion(interaction)] })

        const filter = (m) => m.author.id === interaction.user.id && ['s', 'sim', 'n', 'nao'].includes(m.content.toLowerCase());

        await interaction.channel
            .awaitMessages({
                filter,
                max: 1,
                time: 15000,
                errors: ['time'],
            })
            .then(async (response) => {
                response = await response.first();

                response.delete();

                if (response.content.toUpperCase() == 'SIM' || response.content.toUpperCase() == 'S') {

                    const servidores = ['awp', 'mix', 'retake', 'retakepistol', 'arena'];

                    let rows, rows1;
                    for (let serverNumber in servidores) {

                        const con = connection.promise();

                        try {
                            [rows] = await con.query(
                                `select lvl_${servidores[serverNumber]}.steam, 
                lvl_${servidores[serverNumber]}.name, 
                lvl_${servidores[serverNumber]}.value, du_users.userid from lvl_${servidores[serverNumber]} 
                inner join du_users on lvl_${servidores[serverNumber]}.steam = du_users.steamid order by value desc limit 5`
                            );
                        } catch (error) {
                            return (
                                interaction.editReply({ embeds: [InternalServerError(interaction)] })
                                    .then(() => setTimeout(() => {
                                        interaction.deleteReply()
                                    }, 8000)),
                                console.error(chalk.redBright('Erro no Select'), error)
                            );
                        }

                        async function DeletarRank() {
                            try {
                                await con.query(`delete from lvl_${servidores[serverNumber]}`);
                            } catch (error) {
                                return (
                                    interaction.followUp(CheckDatabaseError(interaction, servidores, serverNumber))
                                        .then((m) => setTimeout(() => {
                                            m.delete()
                                        }, 8000)),
                                    console.error(chalk.redBright('Erro no Delete'), error)
                                );
                            }
                        }

                        let procurar = rows.find((m) => m.userid !== '');
                        if (procurar !== undefined) {
                            try {
                                [rows1] = await con.query(
                                    `select * from vip_sets where steamid = "${procurar.steam}" AND server_id = (select id from vip_servers where server_name = "${servidores[serverNumber]}")`
                                );
                            } catch (error) {
                                return (
                                    interaction.followUp({ embeds: [InternalServerError(interaction)] })
                                        .then((m) => setTimeout(() => {
                                            m.delete()
                                        }, 8000)),
                                    console.error(chalk.redBright('Erro no Select'), error)
                                );
                            }
                            let fetchedUser
                            try {

                                fetchedUser = await interaction.guild.members.cache.get(procurar.userid);
                                if (!fetchedUser) throw new Error('User Not Found on Discord')

                            } catch (error) {
                                interaction.followUp({ embeds: [Top1NotFound(interaction, servidores, serverNumber, procurar)] })
                                await DeletarRank();
                                continue;
                            }

                            let dataInicial = Date.now();
                            dataInicial = Math.floor(dataInicial / 1000);

                            let dataFinal = dataInicial + 30 * 86400,
                                DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');

                            let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


                            if (rows1 == '') {
                                try {
                                    await con.query(
                                        `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                        SELECT '${fetchedUser.user.username}' ,'${procurar.steam}', '${procurar.userid}', 'vip', '${DataInicialUTC}', '${DataFinalUTC}', '1', '0', 
                        vip_servers.id FROM vip_servers WHERE server_name = '${servidores[serverNumber]}'`
                                    );
                                } catch (error) {
                                    //tratar erro
                                    console.error(chalk.redBright('Erro no Insert'), error);
                                }
                            } else if (
                                rows1[0].date_final != '0' &&
                                rows1[0].date_final != null &&
                                rows1[0].isVip == 1 && rows1[0].cargo == 'vip'
                            ) {
                                //Gambiarra :)
                                dataFinal =
                                    rows1[0].date_final.slice(3, 5) +
                                    '/' +
                                    rows1[0].date_final.slice(0, 2) +
                                    '/' +
                                    rows1[0].date_final.slice(6, 10);

                                dataFinal = Date.parse(dataFinal) / 1000 + 30 * 86400;
                                DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');
                                try {
                                    await con.query(
                                        `update vip_sets set name = '${fetchedUser.user.username}',
                                            steamid = '${procurar.steam}',
                                            discord_id = '${procurar.userid}', 
                                            cargo = 'vip', 
                                            date_create = '${DataInicialUTC}', 
                                            date_final = '${DataFinalUTC}', 
                                            isVip = '1', 
                                            valor = '0'
                                            WHERE (steamid='${procurar.steam}' 
                                            OR discord_id='${procurar.userid}') AND vip_sets.server_id = (select vip_servers.id from vip_servers 
                                            where vip_servers.server_name = '${servidores[serverNumber]}')`
                                    );
                                } catch (error) {

                                    interaction.editReply({ embeds: [InternalServerError(interaction)] })
                                    console.error(chalk.redBright('Erro no Update'), error)
                                    await DeletarRank()
                                    continue;
                                }
                            } else {
                                interaction.channel.send(`Não teve nenhum **TOP** no servidor **${servidores[serverNumber]}**`)
                                    .then((m) => setTimeout(() => {
                                        m.delete()
                                    }, 8000))
                                await DeletarRank();
                                continue;
                            }

                            try {
                                [rows] = await con.query(
                                    `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidores[serverNumber]}')`
                                );
                            } catch (error) {

                                interaction.channel.send(
                                    `Aconteceu algum erro ao checar a Database do **${servidores[serverNumber]}**, contate o 1Mack`
                                )
                                    .then((m) => setTimeout(() => {
                                        m.delete()
                                    }, 8000)),
                                    console.error(chalk.redBright('Erro no Select'), error)
                                await DeletarRank()
                                continue;
                            }
                            let setInfos = rows.map((item) => {
                                return `"${item.steamid}"  "@${item.cargo}" //${item.name
                                    }  ${`(${item.date_create} - ${item.discord_id} - ${item.date_final})`})`;
                            });

                            setInfos = setInfos.join('\n');

                            const serversInfosFound = serversInfos.find((m) => m.name === servidores[serverNumber]);

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

                                    interaction.channel.send(InternalServerError(interaction))
                                        .then((m) => setTimeout(() => {
                                            m.delete()
                                        }, 8000))
                                    console.error(chalk.redBright('Erro na Setagem'), error)

                                }

                                try {
                                    fetch(
                                        `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/command`,
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${panelApiKey.api}`,
                                            },
                                            body: JSON.stringify({ command: 'sm_reloadadmins' }),
                                        }
                                    );
                                } catch { }
                            }

                            interaction.channel.send({ embeds: [SetSuccess(interaction, fetchedUser, servidores, serverNumber)] })
                                .then((m) => setTimeout(() => {
                                    m.delete()
                                }, 8000))

                            if (!fetchedUser.roles.cache.has(serversInfosFound.tagVip)) {
                                fetchedUser.roles.add(serversInfosFound.tagVip)
                            }
                            if (!fetchedUser.roles.cache.has('753728995849142364')) {
                                fetchedUser.roles.add('753728995849142364')
                            }

                            fetchedUser.setNickname('VIP | ' + fetchedUser.user.username).catch(() => { })

                            let guild = client.guilds.cache.get('792575394271592458');

                            const canal = guild.channels.cache.find(
                                (channel) => channel.id === '851458777470337084'
                            );
                            canal.send({
                                embeds: [
                                    logVip(
                                        interaction.user,
                                        fetchedUser,
                                        procurar,
                                        DataInicialUTC,
                                        DataFinalUTC,
                                        servidores,
                                        serverNumber
                                    )
                                ]
                            });
                            fetchedUser.send({ embeds: [vipSendMSG(fetchedUser.user, servidores, serverNumber)] }).catch(() => { })
                            await DeletarRank();
                        } else {
                            interaction.channel.send(`Não teve nenhum **TOP** no servidor **${servidores[serverNumber]}**`)
                                .then((m) => setTimeout(() => {
                                    m.delete()
                                }, 8000))
                            await DeletarRank();
                            continue;
                        }
                    }
                } else if (response.content.toUpperCase() == 'NAO' || response.content.toUpperCase() == 'N') {

                    interaction.channel.send(`Abortando comando<a:savage_loading:837104765338910730>`)
                        .then((m) => setTimeout(() => {
                            m.delete()
                        }, 8000))
                }
            })
            .catch((err) => {
                console.log(err)
                interaction.channel.send(`Você não respondeu a tempo, abortando comando<a:savage_loading:837104765338910730>`)
                    .then((m) => setTimeout(() => {
                        m.delete()
                    }, 8000))
            });

    },
};
