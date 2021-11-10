const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
const { panelApiKey, connection } = require('../../configs/config_privateInfos');
const { serversInfos, normalServerRoles } = require('../../configs/config_geral');

const { NotTarget, AskQuestion, SetSuccess, isDono, staffSendAllMSG } = require('./embed');
const { PlayerDiscordNotFound, WrongServer, InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'setarstaff',
    description: 'Setar um cargo para algum player',
    options: [
        {name: 'discord', type: 6, description: 'discord do player', required: true, choices: null},
        {name: 'steamid', type: 3, description: 'Steamid do player', required: true, choices: null},
        {name: 'cargo', type: 3, description: 'Escolha um cargo para o Set', required: true, choices: normalServerRoles.map(m => { return {name: m, value: m}})},
        {name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return {name: m.name, value: m.name}})},
        {name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null}
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '831219575588388915', type: 1, permission: true}], // Perm Set
    async execute(client, interaction) {
        

        let discord1 = interaction.options.getUser('discord'),
        steamid = interaction.options.getString('steamid'),
        cargo = interaction.options.getString('cargo').toLowerCase(),
        servidor = interaction.options.getString('servidor').toLowerCase(),
        extra = interaction.options.getString('observações');

      interaction.deferReply()

        if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        if (
            (steamid == 'STEAM_1:1:79461554' || ['fundador', 'diretor', 'gerente'].includes(cargo)) &&
            interaction.user.id !== '323281577956081665'
        )
            return interaction.followUp({embeds: [NotTarget(interaction)], ephemeral: true})


        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        let fetchedUser
        try {
            fetchedUser = await interaction.guild.members.cache.get(discord1.id);
        } catch (error) {
            return interaction.followUp({embeds: [PlayerDiscordNotFound(interaction)], ephemeral: true})
        }

        let logStaff = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(fetchedUser.user.username.toString())
            .addFields(
                { name: 'Discord', value: discord1.toString() },
                { name: 'Steamid', value: steamid },
                { name: 'Cargo', value: cargo },
                { name: 'Servidor', value: servidor },
                {name: 'Observações', value: extra}
            )
            .setTimestamp()
            .setFooter(`Setado Pelo ${interaction.user.username}`);

        

        let guild = client.guilds.cache.get('792575394271592458');

        const canal = guild.channels.cache.find((channel) => channel.id === '792576052144373760');

        let rows;
        const con = connection.promise();

        try {
            [rows] = await con.query(
                `select steamid, server_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
            );
        } catch (error) {
            return (
                interaction.followUp({embeds: [InternalServerError(interaction)], ephemeral: true}),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }
        let opa = undefined;
        if (rows != '') {
            await interaction.followUp({embeds: [AskQuestion(interaction)]}).then(async (m) => {

                let filter = (m) => m.author.id === interaction.user.id && ['s', 'sim', 'n', 'nao'].includes(m.content.toLowerCase());

                await m.channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 15000,
                        errors: ['time'],
                    })
                    .then((message) => {
                        message = message.first();
                        message.delete();

                        if (message.content.toLowerCase() == 'nao' || message.content.toLowerCase() == 'n') {
                            return (opa = interaction.editReply({content: '**Abortando Comando** <a:savage_loading:837104765338910730>', embeds:[]})
                                .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                        } else if (message.content.toLowerCase() == 'sim' || message.content.toLowerCase() == 's') {
                            return (opa = 's');
                        }
                    })
                    .catch(() => {
                        return (opa = interaction.editReply({content:
                                '**Você não respondeu a tempo!!! lembre-se, você tem apenas 15 segundos para responder!** \n***Abortando Comando*** <a:savage_loading:837104765338910730>',
                            embeds:[]
                        })
                            .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                    });
            });
        }

        let dataInicial = Date.now();
        dataInicial = Math.floor(dataInicial / 1000);

        let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');
        
        try {
            if (opa === 's') {
                await con.query(
                    `update vip_sets set
            name = '${fetchedUser.user.username}',
            steamid = '${steamid}',
            discord_id = '${discord1.id}', 
            cargo = '${cargo}', 
            date_create = '${DataInicialUTC}', 
            date_final = '', 
            isVip = '0', 
            valor = ''
            WHERE (steamid='${steamid}' OR discord_id='${discord1.id}') AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
                );
            } else if (opa === undefined) {
                await con.query(
                    `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                SELECT '${fetchedUser.user.username}', '${steamid}', '${discord1.id}', '${cargo}', '${DataInicialUTC}', '', '0', '', 
                vip_servers.id FROM vip_servers WHERE server_name = '${servidor}'`
                );
            } else return opa;
        } catch (error) {
            return (
                interaction.editReply({embeds: [InternalServerError(interaction)], ephemeral: true}),
                console.error(chalk.redBright('Erro no Insert'), error)
            );
        }

        [rows] = await con.query(
            `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
        );
        let setInfos = rows.map((item) => {
            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${
                item.isVip == 1
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
                    interaction.editReply({embeds: [InternalServerError(interaction)], ephemeral: true}),
                    console.error(chalk.redBright('Erro na Setagem'), error)
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
            } catch {}
        }

        interaction.editReply({embeds: [SetSuccess(interaction, fetchedUser.user, cargo)], ephemeral: true})
        
        try {
            if(!fetchedUser.roles.cache.has(serversInfosFound.tagDoCargo)){
                fetchedUser.roles.add(serversInfosFound.tagDoCargo)
            }
            if(!fetchedUser.roles.cache.has('722814929056563260')){
                fetchedUser.roles.add('722814929056563260')
            }
            let formRole = await fetchedUser.roles.cache.find(m => m.name == `Entrevista | ${(servidor).toUpperCase()}`)

            if(formRole){
                fetchedUser.roles.remove(formRole)
            }
            
            fetchedUser.setNickname('Savage | ' + fetchedUser.user.username);
            

        } catch (error) {
            interaction.followUp({content: `${interaction.user} **| Não consegui setar o cargo/Renomear o player, faça isso manualmente!!**`, ephemeral: true})
        }

        canal.send({embeds: [logStaff]});
        client.channels.cache.get('710288627103563837').send({embeds: [staffSendAllMSG(fetchedUser.user, cargo, servidor)]});
    },
};
