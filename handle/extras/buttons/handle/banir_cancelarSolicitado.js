const { MessageActionRow, MessageButton } = require("discord.js");
const { BanirTemp } = require("../../../../commands/ban/handle/banir");

exports.Solicitado_banirCancelar = async function (interaction, client, type) {

    if (!interaction.member.roles.cache.has('778273624305696818')) {
        return interaction.reply({ content: 'Voce não pode reagir a esse botão!', ephemeral: true })
    }

    const button = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('cancel')
            .setLabel('NÃO')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('confirm')
            .setLabel('SIM')
            .setStyle('DANGER')

    )
    let msg = await interaction.channel.send(`${interaction.user} deseja concluir essa ação?`)

    interaction.message.edit({ components: [] })

    await msg.edit({ components: [button] })

    const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id && i.message.id == msg.id;
    };
    let endExit = false
    await msg
        .awaitMessageComponent({ filter, time: 50000, componentType: 'BUTTON', errors: ['time'] })
        .then(async ({ customId }) => {

            if (customId == 'cancel') {
                endExit = true

            } else {
                if (type == 'banirSolicitado') {
                    let message = interaction.message.embeds
                    for (let i in message) {
                        message[i].color = '57F287'
                    }
                    message[0].title = `Banido pelo ${interaction.user.username}`
                    let banirMSG = message[0].fields

                    await BanirTemp(client, interaction, banirMSG[0].value, banirMSG[1].value, '0', banirMSG[3].value, banirMSG[4] ? banirMSG[4].value : undefined)
                    interaction.message.edit({ embeds: message })
                    msg.delete()
                } else if (type == 'cancelarSolicitado') {
                    let message = interaction.message.embeds
                    for (let i in message) {
                        message[i].color = 'ED4245'
                    }
                    message[0].title = `Negado pelo ${interaction.user.username}`

                    interaction.message.edit({ embeds: message })
                } else {
                    let message = interaction.message.embeds
                    for (let i in message) {
                        message[i].color = '57F287'
                    }
                    message[0].title = `Ban confirmado pelo ${interaction.user.username}`

                    interaction.message.edit({ embeds: message })
                }
            }
        }).catch(() => { endExit = true })

    if (endExit) {
        button.setComponents(
            new MessageButton()
                .setCustomId('cancelarSolicitado')
                .setLabel('CANCELAR')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('banidoSolicitado')
                .setLabel('JÁ FOI BANIDO')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('banirSolicitado')
                .setLabel('BANIR')
                .setStyle('DANGER')
        )
        interaction.message.edit({ components: [button] })
        msg.edit({ content: 'Ação cancelada!', components: [] }).then(() => setTimeout(() => {
            msg.delete()
        }, 5000))
    }
    if (type != 'banirSolicitado') {
        msg.edit({ content: 'Ação concluida com sucesso!', components: [] }).then(() => setTimeout(() => {
            msg.delete()
        }, 5000))
    }
}