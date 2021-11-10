const Discord = require('discord.js');

exports.BanSucess = function (user, nick, steamid) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${user} O Player ${nick}, cuja Steamid é ${steamid} foi **banido** com sucesso !`
        );
    return embed;
};

exports.Banlog = function (nick, steamid, tempo, reason, user) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`**DISCORD**`)
        .addFields(
            { name: 'Nick Do Acusado', value: nick },
            { name: 'Steamid', value: steamid },
            {
                name: 'Tempo Do Banimento',
                value: tempo == 0 ? '**PERMANENTE**' : tempo + ' ' + 'Minuto(s)',
            },
            { name: 'Motivo', value: reason }
        )
        .setFooter(`Banido Pelo ${user.username}`);
    return embed;
};

exports.BanError = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${user}, houve um erro ao tentar banir o player !`);
    return embed;
};
exports.MackNotTarget = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo !`);
    return embed;
};