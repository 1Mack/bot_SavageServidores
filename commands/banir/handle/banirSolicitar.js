const { connection } = require('../../../configs/config_privateInfos');
const { BanSucess, Banlog, BanError, MackNotTarget } = require('./embed');
const chalk = require('chalk');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

exports.BanirSolicitar = async function (client, interaction, nick, steamid, servidor, motivo, userDiscord, files) {

    if (steamid.startsWith('STEAM_0')) {
        steamid = steamid.replace('0', '1');
    }

    if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
        return interaction.reply({ embeds: [MackNotTarget(interaction)], ephemeral: true })

    let attachments = []
    files.forEach(file => {
        if (file) {
            attachments.push(new MessageAttachment(file.attachment))
        }
    })

    if (attachments.length == 0)
        return interaction.reply({ content: '**Você deve enviar ao menos 1 prova!!**', ephemeral: true })

    interaction.reply({ content: '**Sugestão de banimento enviada com sucesso!**', ephemeral: true })

    let embeds = [new MessageEmbed().setTitle('Nova sugestão de ban').setColor('36393f').setFields(
        { name: 'Nick', value: nick },
        { name: 'SteamID', value: steamid },
        { name: 'Servidor', value: servidor },
        { name: 'Motivo', value: motivo }
    ).setFooter({ text: `Solicitado pelo ${interaction.user.username} (${interaction.user.id})` })]
    if (userDiscord) {
        embeds[0].addField('Discord', `${userDiscord}`)
    }

    const button = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('cancelarSolicitado')
            .setLabel('CANCELAR')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('banirSolicitado')
            .setLabel('BANIR')
            .setStyle('DANGER')

    )
    attachments.forEach(att => {
        embeds.push(new MessageEmbed().setColor('36393f').setImage(att.attachment))
    })
    interaction.guild.channels.cache.get('876903682279608351').send({ embeds: embeds, components: [button] })

};
