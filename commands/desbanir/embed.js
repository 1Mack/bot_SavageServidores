const Discord = require('discord.js');

exports.DesbanLog = function (steamid, reason, interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#4287f5')
        .setTitle(`**DESBAN**`)
        .addFields({ name: 'Steamid', value: steamid }, { name: 'Motivo', value: reason })
        .setFooter(`Desbanido Pelo ${interaction.user.username}`);
    return embed;
};

exports.PlayerNotFound = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, não achei ninguem banido com essa steamid !`);
    return embed;
};
