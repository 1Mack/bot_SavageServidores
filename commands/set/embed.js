const Discord = require('discord.js');
exports.NotTarget = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo/não pode setar Fundador, Diretor e Gerente!`
        );
    return embed;
};

exports.logVip = function (fetchUser, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, valor, extra, interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser.username.toString())
        .addFields(
            { name: 'discord', value: discord1.toString() },
            { name: 'Steamid', value: steamid },
            { name: 'Data da Compra', value: DataInicialUTC.toString() },
            { name: 'Data Final', value: DataFinalUTC == 0 ? '**PERMANENTE**' : DataFinalUTC.toString() },
            { name: 'Cargo', value: cargo },
            { name: 'Valor', value: valor.toString() },
            { name: 'Observações', value: extra }
        )
        .setFooter(`Setado Pelo ${interaction.user.username}`);
    return embed;
};

exports.vipSendMSG = function (fetchUser, cargo, tempo, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***A sua compra foi concluída com sucesso!***\n\nAgradecemos pela confiança e esperamos que você se divirta com seu novo cargo 🥳`
        )
        .addFields(
            { name: '**Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
            { name: '**Tempo de Duração**', value: `\`\`\`${tempo == 0 ? 'Permanente' : `${tempo} Dias`}\`\`\`` },
            { name: '**Servidor Escolhido**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` }
        );
    return embed;
};

exports.AskQuestion = function (interaction) {
    const embed = new Discord.MessageEmbed().setColor('#cce336').setDescription(
        `<a:warning_savage:856210165338603531> ${interaction.user},  O player que voce esta tentando setar já possui um cargo.
        \n**Digite \`SIM\` - Para eu excluir o cargo anterior e setar o novo**
        \n**ou**\n\n**Digite \`NAO\` - Para que eu deixe o cargo antigo e não ponha o novo**`
    );
    return embed;
};

exports.SetSuccess = function (interaction, fetchedUser, cargo) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${interaction.user}, O **${fetchedUser.username}** foi setado com o cargo **${cargo}** in-game com sucesso !`
        );
    return embed;
};

exports.isDono = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Somente o 1MaaaaaacK pode setar alguém de dono !`
        );
    return embed;
};

exports.staffSendAllMSG = function (fetchUser, cargo, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle('***Novo Staff***')
        .addFields(
            { name: 'Jogador', value: fetchUser.username.toString() },
            { name: 'Cargo', value: cargo.toUpperCase() },
            { name: 'Servidor', value: servidor.toUpperCase() }
        )
        .setThumbnail(fetchUser.avatarURL())
        .setTimestamp();
    return embed;
};
