const { MessageEmbed } = require('discord.js');

exports.SuccessCaptcha = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${interaction.user}, agora você pode ver todos os canais do discord !!`
        );
    return embed;
};

exports.WrongCaptcha1 = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Você errou o captcha!!

            Você terá mais uma chance para fazer, se errar, entrará em quarentena!!
            
            **Novo Captcha começando em 10 segundos <a:savage_loading:837104765338910730>**`
        );
    return embed;
};

exports.WrongCaptcha2 = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Você errou o captcha novamente!!\n\n**Por isso estará recebendo o cargo <@&924676943041941505>**`
        );
    return embed;
};

exports.MissingTimeCaptcha = function (interaction) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Você não respondeu o captcha a tempo!!\n\n**Deletando Canal <a:savage_loading:837104765338910730>**`
        );
    return embed;
};


exports.ChannelCreated = function (user, m) {
    const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`<a:right_savage:856211226300121098> ${user}, sua sala já foi criada
        [CLIQUE AQUI PARA FAZER O CAPTCHA!!!](https://discord.com/channels/343532544559546368/${m.id})`);
    return embed;
};
