const fetch = require('node-fetch');
const { panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos, paidRoles } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');
const { NotTarget, AskQuestion, SetSuccess, vipSendMSG, logVip } = require('./embed');
const {
    GerenteError,
    PlayerDiscordNotFound,
    InternalServerError,
} = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'setar',
    description: 'Setar um cargo comprado para algum player',
    options: [
        {name: 'discord', type: 6, description: 'discord do player', required: true, choices: null},
        {name: 'steamid', type: 3, description: 'Steamid do player', required: true, choices: null},
        {name: 'cargo', type: 3, description: 'Escolha um cargo para o Set', required: true, choices: paidRoles.map(m => { return {name: m, value: m}})},
        {name: 'tempo', type: 4, description: 'Tempo em dias do set', required: true, choices: null},
        {name: 'valor', type: 10, description: 'Valor pago pelo player', required: true, choices: null},
        {name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return {name: m.name, value: m.name}})},
        {name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null}
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}, {id: '831219575588388915', type: 1, permission: true}], // Gerente
    async execute(client, interaction) {
        let discord1 = interaction.options.getUser('discord'),
        steamid = interaction.options.getString('steamid'),
        cargo = interaction.options.getString('cargo').toLowerCase(),
        tempo = interaction.options.getInteger('tempo'),
        valor = interaction.options.getNumber('valor'),
        servidor = interaction.options.getString('servidor').toLowerCase(),
        extra = interaction.options.getString('observações');

        await interaction.deferReply()

        try{
        if (steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        if (steamid == 'STEAM_1:1:79461554' && message.author.id !== '323281577956081665')
        
            return interaction.followUp({embeds: [NotTarget(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (
            !interaction.member._roles.find(m => m == serversInfosFound.gerenteRole) &&
            !interaction.member._roles.find(m => m == '831219575588388915')
        )
            return interaction.followUp({embeds: [GerenteError(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        let dataInicial = Date.now();
        dataInicial = Math.floor(dataInicial / 1000);
        let dataFinal = 0,
            DataFinalUTC = 0;

        if (tempo !== 0) {
            dataFinal = dataInicial + tempo * 86400;
            DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');
        }
        let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


        let fetchedUser
        try {
             fetchedUser = await interaction.guild.members.cache.get(discord1.id);
        } catch (error) {
            return interaction.followUp({embeds: [PlayerDiscordNotFound(interaction)], ephemeral: true})
        }

        let guild = client.guilds.cache.get('792575394271592458');

        const canal = guild.channels.cache.find(
            (channel) => channel.name === serversInfosFound.canalAlvo && channel.parentId == '792575394271592459'
        );

        let isVip = false;

        if (cargo == 'vip') {
            isVip = true;
        } else {
            cargo = cargo.concat('p');
        }

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

        let opa;

        if (rows != '') {
            await interaction.followUp({embeds: [AskQuestion(interaction)]}).then(async (m) => {
                
                let filter = (m) => m.author === interaction.user && ['s', 'sim', 'n', 'nao'].includes(m.content.toLowerCase());

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
                            return (opa = interaction.editReply({content: '**Abortando Comando** <a:savage_loading:837104765338910730>', embeds: []})
                                .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                        } else if (message.content.toLowerCase() == 'sim' || message.content.toLowerCase() == 's') {
                            return (opa = 's');
                        }
                    })
                    .catch((err) => {
                        return (opa = interaction.editReply({content: '**Abortando Comando** <a:savage_loading:837104765338910730>', embeds: []})
                            .then(() => setTimeout(() => interaction.deleteReply(), 10000)), console.log(err))
                    });
            });
        }

        try {
            if (opa === 's') {
                await con.query(
                    `update vip_sets set name = '${fetchedUser.user.username}',
            steamid = '${steamid}',
            discord_id = '${discord1.id}', 
            cargo = '${cargo}', 
            date_create = '${DataInicialUTC}', 
            date_final = '${DataFinalUTC}', 
            isVip = '1', 
            valor = '${valor}'
            WHERE (steamid='${steamid}' OR discord_id='${discord1.id}') AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
                );
            } else if (opa === undefined) {
                await con.query(
                    `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                SELECT '${fetchedUser.user.username}' ,'${steamid}', '${discord1.id}', '${cargo}', '${DataInicialUTC}', '${DataFinalUTC}', '1', '${valor}', 
                vip_servers.id FROM vip_servers WHERE server_name = '${servidor}'`
                );
            } else return opa;
        } catch (error) {
            return (
                interaction.editReply({embeds: [InternalServerError(interaction)], ephemeral: true}),
                console.error(chalk.redBright('Erro no Insert'), error)
            );
        }
        try {
            [rows] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } catch (error) {
            return console.error(chalk.redBright('Erro no Select'), error);
        }

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
        ||
        interaction.followUp({embeds: [SetSuccess(interaction, fetchedUser.user, cargo)], ephemeral: true})

        try {
            if (isVip == false) {
                
                if(!fetchedUser.roles.cache.has(serversInfosFound.tagComprado)){
                    fetchedUser.roles.add(serversInfosFound.tagComprado)
                }
                if(!fetchedUser.roles.cache.has('722814929056563260')){
                    fetchedUser.roles.add('722814929056563260')
                }
                
                if(!fetchedUser.user.username.includes('Savage |')){
                    fetchedUser.setNickname('Savage | ' + fetchedUser.user.username);
                }
            } else {
                
                if(!fetchedUser.roles.cache.has(serversInfosFound.tagVip)){
                    fetchedUser.roles.add(serversInfosFound.tagVip)
                }
                if(!fetchedUser.roles.cache.has('753728995849142364')){
                    fetchedUser.roles.add('753728995849142364')
                }
                if(fetchedUser.nickname != undefined){
                    
                    if(!fetchedUser.nickname.includes('Savage |')){
                        fetchedUser.setNickname('VIP | ' + fetchedUser.user.username);
                    }
                }else {
                    fetchedUser.setNickname('VIP | ' + fetchedUser.user.username);

                }
            }
        } catch (error) {
            interaction.followUp({content: `${interaction.user} **| Não consegui setar o cargo/Renomear o player, faça isso manualmente!!**`, ephemeral: true})
            console.log(error)
        }
        
        canal.send({embeds: [logVip(fetchedUser.user, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, valor, extra, interaction)]});
        fetchedUser.send({embeds: [vipSendMSG(fetchedUser.user, cargo, tempo, servidor)]});
    }catch(err){
        console.log(err)
        
    }
    },
};