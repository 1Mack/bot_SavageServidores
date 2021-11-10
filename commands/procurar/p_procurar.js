const {Util, MessageEmbed} = require('discord.js');
const { serversInfos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');
const { GerenteError, InternalServerError } = require('../../embed/geral');
const { SteamIdNotFound } = require('./embed');
const chalk = require('chalk');

module.exports = {
    name: 'procurar',
    description: 'Ver o cargo de um staff atrabés do @ dele',
    options: [{name: 'servidor', type: 3, description: 'Escolher um Servidor para o Set', required: true, choices: serversInfos.map(m => { return {name: m.name, value: m.name}})},
            {name: 'steamid', type: 3, description: 'steamid do Player', required: false, choices: null}],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}], // Gerente
    async execute(client, interaction) {
        let steamid = interaction.options.getString('steamid'),
        servidor = interaction.options.getString('servidor').toLowerCase()


        if(steamid){
            if (steamid.startsWith('STEAM_0')) {
                steamid = steamid.replace('0', '1');
            }
        }
        const serversInfosFound = serversInfos.find((m) => m.name === servidor);


        if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole))
            return interaction.reply({embeds: [GerenteError(interaction)], ephemeral: true})

        let rows;
        const con = connection.promise();

        try {
            [rows] = await con.query(
                `select * from vip_sets where ${
                    steamid == undefined ? `server_id =` : `steamid = "${steamid}" AND server_id =`
                }(select id from vip_servers where server_name = "${servidor}")`
            );
        } catch (error) {
            return (
                interaction.reply({embeds: [InternalServerError(interaction)], ephemeral: true}),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }
        if (rows == '') {
            return interaction.reply({embeds: [SteamIdNotFound(interaction, steamid)], ephemeral: true})
        }
        let setInfos = rows.map((item) => {
            return `"${item.steamid}"  "@${item.cargo}" //${
                item.isVip == 0
                    ? `${item.name}  (${item.discord_id})`
                    : `${item.name} (${item.date_create} - ${item.discord_id} - ${item.date_final})`
            }`;
        });

        setInfos = setInfos.join('\n');

        interaction.reply({content: `**${interaction.user} | Te mandei os players setados no seu privado!**`, ephemeral: true})

        const [first, ...rest] = Util.splitMessage(setInfos, { maxLength: 4096 });

        const logStaffFind = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(
                steamid !== undefined ? `Set do Player no servidor ${servidor}` : `Players Setados no ${servidor}`
            )
            .setDescription(`\`\`\`${first}\`\`\``);

        if (!rest.length) {
            return interaction.user.send({embeds: [logStaffFind]});
        }

        await interaction.user.send({embeds: [logStaffFind]});

        for (const text of rest) {
            logStaffFind.setDescription(`\`\`\`${text}\`\`\``);
            logStaffFind.setTitle('');
            await interaction.user.send({embeds: [logStaffFind]});
        }
    },
};
