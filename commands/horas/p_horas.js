const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { GerenteError } = require('../../embed/geral');
const { HorasLog, StaffHoursNotFound, HoursNotFoundError } = require('./embed');
module.exports = {
    name: 'horas',
    description: 'Ver as horas in-game dos staffs',
    options: [{ name: 'servidor', type: 3, description: 'Escolha um Servidor', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
    { name: 'steamid', type: 3, description: 'Steamid do staff', required: true, choices: null }],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '711022747081506826', type: 1, permission: true }], // Gerente
    async execute(client, interaction) {

        let steamid = interaction.options.getString('steamid'),
            servidor = interaction.options.getString('servidor').toLowerCase()

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole))
            return interaction.reply({ embeds: [GerenteError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const con = connection.promise();

        try {
            let [result] = await con.query(`SELECT * FROM mostactive_${servidor} WHERE steamid = '${steamid}'`);

            if (result == '') {
                return interaction.reply({ embeds: [StaffHoursNotFound(interaction)], ephemeral: true })
            }

            function HourFormat(duration) {
                var hrs = ~~(duration / 3600);
                var mins = ~~((duration % 3600) / 60);

                if (mins == 0) {
                    return `${hrs} horas`
                } else if (hrs == 0) {
                    return `${mins} minutos`
                } else {
                    return `${hrs} horas e ${mins} minutos`
                }
            }

            interaction.reply({ embeds: [HorasLog(result, HourFormat, servidor, steamid, interaction)] });
        } catch (error) {
            interaction.reply({ embeds: [HoursNotFoundError(interaction)] }).then((m) => setTimeout(() => interaction.deleteReply(), 10000));
            console.log(error);
        }
    },
};
