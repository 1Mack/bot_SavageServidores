const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { guildsInfo } = require('../../configs/config_geral');

exports.LogAdv = function (discord, adv, reason, interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`**ADV**`)
        .addFields(
            {
                name: 'Staff:',
                value: `**${discord}**`,
            },
            { name: 'ADV:', value: `**${adv}**` },
            { name: 'Motivo:', value: reason }
        )
        .setFooter({ text: `Aplicada Pelo ${interaction.user.username}` });
    return embed;
};
exports.AdvWarning = function (interaction, discord) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> O staff ${discord} está com **3 advertências**`
        );
    return embed;
};

exports.AdvSuccess = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`<a:right_savage:856211226300121098> ${interaction.user}, Adv aplicada no staff com sucesso !`);
    return embed;
};

exports.WrongUsage = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Voce não pode por o título, a descrição e a imagem como 'null' todos ao mesmo tempo !`
        );
    return embed;
};

exports.WrongNumber = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, A quantidade máxima de mensagens que eu posso deletar são 99 e a mínima é 1 !`
        );
    return embed;
};

exports.MissingPermission = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction}, Você não tem permissão para excluir msgs de bots. Irei excluir apenas as msgs de players !`
        );
    return embed;
};

exports.OldMessage = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction}, Não consegui excluir as msgs, provavelmente tem alguma que é mais antiga do que 14 dias! !`
        );
    return embed;
};

exports.WrongUsageOfCommand = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction}, Você escreveu algo errado, digite !rsugestao para ver a forma correta de usar o comando !`
        );
    return embed;
};
exports.newEmbed = function (valido, m, resposta, interaction) {
    const embed = new MessageEmbed()
        .setColor(valido.color)
        .setTitle(`***${valido.title}***`)
        .addFields(
            { name: '\u200B', value: '**Sugerido Por**', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: m.embeds[0].title, inline: true },
            { name: '\u200B', value: `**Sugestão**`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: m.embeds[0].description, inline: true },
            { name: '\u200B', value: '**Resposta**', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: resposta, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
        )
        .setFooter({ text: `Respondido pelo ${interaction.user.username}` })
        .setTimestamp();
    return embed;
};
exports.UserSendEmbed = function (valido, interaction) {
    const embed = new MessageEmbed()
        .setColor(valido.color)
        .setTitle(`Sua sugestão foi ${valido.title.substring(0, valido.title.length - 1) + 'a'}!`)
        .setDescription(`> Link da sua sugestão: 
    > https://discord.com/channels/${guildsInfo.main}/778411417291980830/${interaction}`);
    return embed;
};

exports.FormAlreadyOpened = function (user) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, Já tem alguem vendo os formulários desse servidor !`
        );
    return embed;
};

exports.FormCompleted = function (user) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, Não há mais ninguém que tenha feito o form !`
        );
    return embed;
};

exports.FormCreated = function (user, canalCheck) {
    const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${user}, [canal criado com sucesso](https://discord.com/channels/${guildsInfo.main}/${canalCheck.id})`
        );
    return embed;
};

exports.LogReprovado = function (fetchUser, servidor) {
    const embed = new MessageEmbed()
        .setColor('CF1616')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(`***Você foi reprovado no formulário do ${servidor}!***`);
    return embed;
};

exports.LogAprovado = function (fetchUser, servidor) {
    const embed = new MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(`***Você passou para a próxima fase do recrutamento para ser staff do __${servidor}__, a qual será feita por [entrevista](https://discord.com/channels/${guildsInfo.main}/947323248968859649)***`);
    return embed;
};

exports.LogAprovadoChannel = function (user, fetchUser, result) {
    const embed = new MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Novo Candidato`)
        .addFields(
            { name: 'Nome', value: fetchUser.username },
            { name: 'Servidor', value: result[result.length - 1].servidor },
            { name: 'Idade', value: result[1].awnser },
            { name: 'Link do Perfil', value: result[2].awnser },
            { name: 'Ajudará Mensalmente?', value: result[7].awnser },
            { name: 'ID', value: fetchUser.id }
        )
        .setFooter({ text: `Aprovado pelo ${user.username}` })
        .setTimestamp();

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('verform_resultado_averiguar')
                .setLabel('Averiguar')
                .setStyle('PRIMARY')
        );
    return { embed, row };
};
exports.logInfos = function (fetchUser, result) {
    const embed = new MessageEmbed()
        .setColor('36393f')
        .setTitle(fetchUser.username)
        .addFields(
            { name: 'ID', value: fetchUser.id },
            { name: 'Nome', value: result[0].awnser },
            { name: 'Idade', value: result[1].awnser },
            { name: 'STEAM', value: result[2].awnser },
            { name: 'Ajudará Mensalmente', value: result[7].awnser }
        );
    return embed;
};
