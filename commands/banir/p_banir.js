const { connection } = require('../../configs/config_privateInfos');
const { BanSucess, Banlog, BanError, MackNotTarget } = require('./embed');
const {serversInfos} = require('../../configs/config_geral')
const chalk = require('chalk');

module.exports = {
    name: 'banir',
    description: 'Banir alguém do servidor',
    options: [{name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null},
            {name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null},
            {name: 'servidor', type: 3, description: 'Qual servidor ele estava?', required: true, choices: serversInfos.map(m => { return {name: m.name, value: m.name}})},
            {name: 'tempo', type: 4, description: 'Valor em minutos', required: true, choices: null},
            {name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null}],
    default_permission: false,
    cooldown: 15,
    permissions: [{id: '778273624305696818', type: 1, permission: true}], //Perm ban
    async execute(client, interaction) {
        let nick = interaction.options.getString('nick'),
            steamid = interaction.options.getString('steamid'),
            servidor = interaction.options.getString('servidor'),
            tempo = interaction.options.getInteger('tempo').toString(),
            reason = interaction.options.getString('motivo');

        if (steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
            return interaction.followUp({embeds: [MackNotTarget(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        
        let timeNow = Date.now();
        timeNow = Math.floor(timeNow / 1000);
        let timeEnd = timeNow + tempo * 60;

        const con = connection.promise();
        let result
        try {
            [result] = await con.query(`SELECT steamid, ip from mostactive_${servidor} where steamid = '${steamid}'`)
        } catch (error) {}
        
        if(result == ''){
            result = [{ip: null}]
        }
        
        try {
            let sqlBans = 'INSERT INTO sb_bans (ip, authid, name, created, ends, length, reason, aid, sid, country, type) VALUES ?',
                SqlBan_VALUES = [[`${result[0].ip}` ,`${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, null, 0]];

            await con.query(sqlBans, [SqlBan_VALUES]);
            client.channels.cache.get('721854111741509744').send({embeds: [Banlog(nick, steamid, tempo, reason, interaction.user)]});
            await interaction.reply({embeds: [BanSucess(interaction.user, nick, steamid)], ephemeral: true})
        } catch (error) {
            interaction.channel.send({embeds: [BanError(interaction.user)]});
            console.error(chalk.redBright('Erro no Banimento'), error);
        }  
    },
};
