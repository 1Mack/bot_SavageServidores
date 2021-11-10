const fetch = require('node-fetch')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { connection, panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos, servidoresHoras } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'horasdemotar',
    description: 'Ver as horas in-game dos staffs',
    options: [{ name: 'servidor', type: 3, description: 'Escolha um Servidor', required: true, choices: servidoresHoras.map(m => { return { name: m, value: m } }) }],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '711022747081506826', type: 1, permission: true }, // Gerente
    { id: '831219575588388915', type: 1, permission: true }], //perm set
    async execute(client, interaction) {

        let servidor = interaction.options.getString('servidor').toLowerCase()

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (!interaction.member.roles.cache.has(serversInfosFound.gerenteRole) && !interaction.member.roles.cache.has('831219575588388915'))
            return interaction.reply({
                content: `😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            })
                .then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const con = connection.promise();

        let canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);

        if (canalCheck === undefined) {
            await interaction.guild.channels.create(`horasdemotar→${interaction.user.id}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
                parent: '818261624317149235',
            });
            canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);
        }
        interaction.deferReply()
        interaction.followUp({ content: `Canal criado com sucesso <#${canalCheck.id}>` }).then(m => {
            setTimeout(() => {
                m.delete()
            }, 5000);
        })

        let guild = client.guilds.cache.get('792575394271592458');

        await canalCheck.bulkDelete(100);

        let msg = await canalCheck.send(`${interaction.user}`)

        let [result] = await con.query(
            `select * from mostactive_${servidor} inner join vip_sets
            on mostactive_${servidor}.steamid = vip_sets.steamid
            where isVip = '0'
            and cargo != 'fundador'
            and cargo != 'diretor'
            and cargo != 'gerente'
            and total < '72000'
            and server_id = (select id from vip_servers where server_name = '${servidor}')`
        );

        if (result == '') {
            return (
                await msg.edit({ content: 'Não achei ninguém com hora menor!! Deletando canal' }),
                await wait(6000),
                canalCheck.delete()
            );
        }
        let outloop
        for (let i in result) {

            function HourFormat(duration) {
                let hrs = ~~(duration / 3600);
                let mins = ~~((duration % 3600) / 60);

                if (mins == 0) {
                    return `${hrs} horas`
                } else if (hrs == 0) {
                    return `${mins} minutos`
                } else {
                    return `${hrs} horas e ${mins} minutos`
                }
            }

            let formMessage = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(result[i].name.toString())
                .addFields(
                    { name: 'Steamid', value: result[i].steamid.toString() },
                    { name: 'DiscordID', value: result[i].discord_id.toString() },
                    { name: 'Cargo', value: result[i].cargo.toString() },
                    { name: 'Último Set', value: result[i].date_create.toString() },
                    { name: `**Horas Totais**`, value: HourFormat(result[i].total) },
                    { name: `**Horas Spec**`, value: HourFormat(result[i].timeSPE) },
                    { name: `**Horas TR**`, value: HourFormat(result[i].timeTT) },
                    { name: `**Horas CT**`, value: HourFormat(result[i].timeCT) },
                    { name: `**Última conexao**`, value: new Date(result[i].last_accountuse * 1000).toLocaleDateString('en-GB') },
                );
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('horasdemotar_demotar')
                        .setLabel('Demotar')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('horasdemotar_proximo')
                        .setLabel('Proximo')
                        .setStyle('PRIMARY'),

                );
            await msg.edit({ content: ' ', embeds: [formMessage], components: [row] });

            const filter = i => {
                i.deferUpdate();
                return i.user.id == interaction.user.id && i.channelId == canalCheck.id;
            };

            await canalCheck
                .awaitMessageComponent({ filter, time: 10000, errors: ['time'] })
                .then(async (collected) => {
                    collected = collected.customId

                    if (collected == 'horasdemotar_proximo') {

                        return;

                    } else if (collected == 'horasdemotar_demotar') {
                        let fetchUser
                        try {
                            fetchUser = await interaction.guild.members.cache.get(result[i].discord_id);
                        } catch (error) { }

                        await con.query(`delete from vip_sets where steamid = '${result[i].steamid}'
                    and server_id = (select id from vip_servers where server_name = '${servidor}')`);
                        await con.query(`delete from mostactive_${servidor} where steamid = '${result[i].steamid}'`);

                        const logDemoted = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(fetchUser ? fetchUser.user.username.toString() : result[i].name.toString())
                            .addFields(
                                {
                                    name: 'discord',
                                    value: fetchUser ? fetchUser.user.toString() : result[i].discord_id.toString(),
                                },
                                { name: 'Steamid', value: result[i].steamid.toString() },
                                { name: 'Servidor', value: servidor.toUpperCase() },
                                { name: 'Observações', value: 'Não cumpriu a meta de 20h' }
                            )
                            .setFooter(`Demotado Pelo ${interaction.user.username} no HORASDEMOTAR`);

                        if (fetchUser) {
                            const demotedSendMSG = new MessageEmbed()
                                .setColor('FF0000')
                                .setTitle(`Olá ${fetchUser.user.username}`)
                                .setDescription(
                                    `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
                                )
                                .addFields(
                                    { name: '**STEAMID**', value: `\`\`\`${result[i].steamid}\`\`\`` },
                                    { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
                                    { name: '**Motivo**', value: `\`\`\`Ter menos do que 20 horas\`\`\`` }
                                );

                            let staffRoles = serversInfos.flatMap(m => [m.tagComprado, m.tagDoCargo])

                            staffRoles = fetchUser._roles.filter(m => staffRoles.includes(m))

                            if (staffRoles.length > 1) {
                                fetchUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]).catch(() => { })
                            } else {
                                fetchUser.roles.remove([
                                    serversInfosFound.tagDoCargo,
                                    '722814929056563260',
                                    serversInfosFound.tagComprado,
                                ]).catch(() => { })

                                fetchUser.setNickname(fetchUser.user.username).catch(() => { });
                            }


                            fetchUser.send({ embeds: [demotedSendMSG] }).catch(() => { })

                        }

                        let canal = guild.channels.cache.find((channel) => channel.id == '792576104681570324');

                        canal.send({ embeds: [logDemoted] });

                        const [result2] = await con.query(
                            `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
                        );
                        let setInfos = result2.map((item) => {
                            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${item.isVip == 1
                                    ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
                                    : `(${item.discord_id})`
                                })`;
                        });

                        setInfos = setInfos.join('\n');

                        for (let j in serversInfosFound.identifier) {
                            try {
                                await fetch(
                                    `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]
                                    }/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
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
                                    await canalCheck.send({
                                        content:
                                            `${interaction.user} **| Não consegui remover o cargo do staff de dentro do servidor, entre em contato com o 1Mack**`, embeds: [], components: []
                                    }).then(async m => {
                                        await wait(10000)
                                        await m.delete()
                                    }),
                                    console.log(error)
                                );
                            }

                            try {
                                fetch(
                                    `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]
                                    }/command`,
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
                    }
                })
                .catch(async (error) => {

                    await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: [] })
                    if(error.code !== 'INTERACTION_COLLECTOR_ERROR') {
                        console.log(error)
                    }
                    await wait(5000)
                    outloop = true
                });

            if (outloop) {
                break;
            }
        }

        if (!outloop) {
            await msg.edit({ content: 'todos os staffs ja foram vistos!\n**Deletando canal em 5 segundos!!**', embeds: [], components: [] });
        }

        await wait(5000)
        await canalCheck.delete();

    },
};
