const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');

exports.MackNotTarget = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo !`);
    return embed;
};

exports.SteamidNotFound = function (interaction, steamid) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, nao achei ninguem a steamid **${steamid}**!`);
    return embed;
};

exports.PlayerDiscordRoleNotFound = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, não achei o discord desse player, você terá que remover o cargo dele do discord manualmente !`
        );
    return embed;
};

exports.DemotedLog = function (fetchUser, steamid, extra, interaction, servidor) {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser.username || 'Indefinido')
        .addFields(
            {
                name: 'discord',
                value: `${fetchUser || 'Indefinido'}`,
            },
            { name: 'Steamid', value: steamid },
            { name: 'Servidor', value: servidor },
            { name: 'Observações', value: extra }
        )
        .setFooter({ text: `Demotado Pelo ${interaction.user.username}` });
    return embed;
};
exports.DemotedSendMSG = function (fetchUser, steamid, servidor, extra) {
    const embed = new MessageEmbed()
        .setColor('FF0000')
        .setTitle(`Olá ${fetchUser.username || 'Indefinido'}`)
        .setDescription(
            `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
        )
        .addFields(
            { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
            { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
            { name: '**Motivo**', value: `\`\`\`${extra}\`\`\`` }
        );
    return embed;
};

exports.DemotedAskConfirm = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ffff00')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user} Tem certeza que quer fazer isso ?`
        );
    const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('sim')
                .setLabel('SIM')
                .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('nao')
                .setLabel('NÃO')
                .setStyle('PRIMARY')
        )
    return { embed, button };
};

exports.DemotedInfo = function (rows, user) {

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setDescription(`Você quer demotar o player com a steamid **${user}** em quais servidores?
        
        Clique na lista abaixo para escolher!`)

    const selectMenu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('demoted_selectMenu')
                .setMaxValues(rows.size)
                .setMinValues(1)
                .addOptions(
                    rows.map((m, i) => {
                        return {
                            label: `${m.serverFind ? m.serverFind.visualName.toUpperCase() : m.row.server_id == '0' ? 'TODOS' : 'Desconhecido'} | ${m.cargo}`,
                            value: `${m.serverFind ? m.serverFind.serverNumber : m.row.server_id}_${i}`
                        }
                    })
                )

        )
    return { embed, selectMenu };
};