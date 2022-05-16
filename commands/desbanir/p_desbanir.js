const { connection, panelApiKey } = require('../../configs/config_privateInfos');
const { DesbanLog, PlayerNotFound } = require('./embed');
const axios = require('axios').default
const { serversInfos } = require('../../configs/config_geral');
const { InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'desbanir',
    description: 'Desbanir alguém do servidor',
    options: [{ name: 'steamid', type: 3, description: 'steamid do Player', required: true, choices: null },
    { name: 'motivo', type: 3, description: 'Motivo do Demoted', required: true, choices: null }],
    default_permission: false,
    cooldown: 30,
    permissions: [{ id: '778273624305696818', type: 1, permission: true }], //Perm Ban
    async execute(client, interaction) {

        let steamid = interaction.options.getString('steamid'),
            motivo = interaction.options.getString('motivo');

        let timeNow = Date.now();
        timeNow = Math.floor(timeNow / 1000);

        const con = connection.promise();

        try {
            let [rows] = await con.query(
                `SELECT authid, RemoveType from sb_bans WHERE authid regexp "${steamid.slice(8)}" AND RemovedOn is null`
            );

            if (rows == '') {
                return interaction.reply({ embeds: [PlayerNotFound(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
            }
            await con.query(
                `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${motivo}" WHERE authid regexp "${steamid.slice(8)}"`
            );
            client.channels.cache.get('721854111741509744').send({ embeds: [DesbanLog(steamid, motivo, interaction)] });
            interaction.reply({ embeds: [DesbanLog(steamid, motivo, interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
        } catch (error) {
            interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
            console.error(chalk.redBright('Erro no Desbanir'), error);
        }

        serversInfos.forEach(m => {
            try {
                axios.post(`https://panel.mjsv.us/api/client/servers/${m.identifier[0]}/command`,
                    JSON.stringify({ command: `removeid STEAM_1:1:79461554` }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${panelApiKey.api}`,
                        }
                    })
            } catch { }
        })

    },
};
