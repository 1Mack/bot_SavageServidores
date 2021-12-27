const { MessageEmbed } = require('discord.js');

exports.HoursNotFoundError = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Houve um erro ao procurar a hora desse player, talvez ele nao esteja no nosso sistema !`
        );
    return embed;
};

exports.StaffHoursNotFound = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, não encontrei as horas desse staff !`);
    return embed;
};

exports.HorasLog = function (result, HourFormat, servidor, steamid, interaction) {
    const embed = new MessageEmbed()
        .setColor('36393f')
        .setTitle(result[0].playername.toString())
        .addFields(
            { name: `**Horas Totais**`, value: HourFormat(result[0].total) },
            { name: `**Horas Spec**`, value: HourFormat(result[0].timeSPE) },
            { name: `**Horas TR**`, value: HourFormat(result[0].timeTT) },
            { name: `**Horas CT**`, value: HourFormat(result[0].timeCT) },
            { name: `**Última conexao**`, value: new Date(result[0].last_accountuse * 1000).toLocaleDateString('en-GB') },
            { name: '**Servidor**', value: servidor.toUpperCase().toString() },
            { name: '**Steamid**', value: steamid.toString() }
        )
        .setFooter(`Horas Requisitadas pelo ${interaction.user.username}`)
        .setTimestamp();
    return embed;
};

exports.minhasHorasEmbed = function (serversFormatDisplay, user) {
    const embed = new MessageEmbed()
        .setColor('36393f')
        .setTitle('Suas horas nos servidores')
        .setDescription(serversFormatDisplay.join(''))
        .setFooter(`Requisitado pelo ${user}`)
        .setTimestamp();
    return embed;
};
