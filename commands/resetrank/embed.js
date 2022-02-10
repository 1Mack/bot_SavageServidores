const { MessageEmbed } = require('discord.js')
exports.CheckDatabaseError = function (interaction, servidores, serverNumber) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user.username}, Aconteceu algum erro ao checar a Database do **${servidores[serverNumber]}**, contate o 1Mack !`
        );
    return embed;
};
exports.AskQuestion = function (interaction) {
    const embed = new MessageEmbed().setColor('#cce336').setDescription(
        `<a:warning_savage:856210165338603531> ${interaction.user.username},  tem certeza que quer resetar o rank de todos os servers e dar ***VIP*** para o TOP1?
        \n**Digite \`SIM\` - Para resetar**
        \n**ou**\n\n**Digite \`NAO\` - Para não resetar**`
    );
    return embed;
};

exports.Top1NotFound = function (interaction, servidores, serverNumber, procurar) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user.username}, Não achei o discord do top1 do **${servidores[serverNumber]}**, <@${procurar.userid}> !`
        );
    return embed;
};

exports.logVip = function (author, fetchedUser, procurar, DataInicialUTC, DataFinalUTC, servidores, serverNumber) {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${fetchedUser.user.username}`)
        .addFields(
            { name: 'discord', value: `<@${procurar.userid}>` },
            { name: 'Steamid', value: procurar.steam.toString() },
            { name: 'Data do Set', value: DataInicialUTC.toString() },
            {
                name: 'Data Final',
                value: DataFinalUTC.toString(),
            },
            { name: 'Cargo', value: 'VIP' },
            { name: 'Valor', value: '0' },
            { name: 'Servidor', value: servidores[serverNumber].toString() }
        )
        .setFooter({ text: `Setado Pelo ${author.username}` });
    return embed;
};
exports.vipSendMSG = function (fetchUser, servidores, serverNumber) {
    const embed = new MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***Você recebeu um VIP de 1 Mês por ter estado no TOP5 do servidor ${servidores[serverNumber]}!***\n\nEsperamos que você se divirta com seu novo cargo 🥳`
        )
        .addFields(
            { name: '**Cargo**', value: `\`\`\`VIP\`\`\`` },
            {
                name: '**Tempo de Duração**',
                value: `\`\`\`30 Dias\`\`\``,
            },
            {
                name: '**Servidor**',
                value: `\`\`\`${servidores[serverNumber]}\`\`\``,
            }
        );
    return embed;
};

exports.SetSuccess = function (interaction, fetchedUser, servidores, serverNumber) {
    const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${interaction.user.username}, O **${fetchedUser.user.username}** foi setado com o cargo **VIP** in-game no **${servidores[serverNumber]}** com sucesso !`
        );
    return embed;
};
