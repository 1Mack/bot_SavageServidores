const { MessageEmbed } = require('discord.js');

exports.SteamIdNotFound = function (interaction, servidor) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Não encontrei ninguém com essa steamid no servidor ${servidor} !`
        );
    return embed;
};
