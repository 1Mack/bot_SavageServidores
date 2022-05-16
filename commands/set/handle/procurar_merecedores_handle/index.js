const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { guildsInfo } = require('../../../../configs/config_geral');
const { UpConfirmed } = require('./upConfirmed');


exports.Diretor_UpConfirm = async function (interaction, client) {

    const guildLog = await client.guilds.cache.get(guildsInfo.log)
    await guildLog.members.fetch()
    const message = await guildLog.channels.cache.get(interaction.channelId).messages.fetch(interaction.message.id)
    const DiretorNumber = Math.floor(guildLog.members.cache.filter(m => m._roles.includes('875481156986998824')).size / 2) + 1

    const embed = new MessageEmbed().setTitle(message.embeds[0].title).setFooter({ text: message.embeds[0].footer.text }).setColor('36393f'),
        row = new MessageActionRow()

    if (interaction.customId == 'up_confirm2') {
        const { components } = message.components[0]

        if (interaction.user.id == '323281577956081665') return (
            await UpConfirmed(message, client, interaction.user)
        )



        if (components[0].label === 'Upar') {

            if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
                return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
            }

            embed.addFields(message.embeds[0].fields, { name: 'Diretores Favoráveis', value: `<@${interaction.user.id}>` })

            row.addComponents(
                new MessageButton()
                    .setCustomId('up_confirm2')
                    .setLabel(`Upar 1/${DiretorNumber}`)
                    .setStyle('DANGER'),
                components[1]
            )



        } else {
            let UparVoteValue = components[0].label.replace('Upar ', '')

            if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
                return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
            }
            if (UparVoteValue === `${DiretorNumber}/${DiretorNumber}` || UparVoteValue === `${DiretorNumber - 1}/${DiretorNumber}`) return (
                UpConfirmed(message, client, interaction.user),
                interaction.reply({ content: 'Seu voto foi decisivo!!!', ephemeral: true })
            )

            UparVoteValue = UparVoteValue.replace(UparVoteValue.charAt(0), Number(UparVoteValue.charAt(0)) + 1)

            const embedField = message.embeds[0].fields.map(m => {
                if (m.name == 'Diretores Favoráveis') {
                    m = { name: 'Diretores Favoráveis', value: `${m.value}, <@${interaction.user.id}>` }
                }

                return m
            })

            embed.addFields(embedField)

            row.addComponents(
                new MessageButton()
                    .setCustomId('up_confirm2')
                    .setLabel(`Upar ${UparVoteValue}`)
                    .setStyle('DANGER'),
                components[1]
            )

        }


    } else if (interaction.customId == 'up_recusado') {
        const { components } = message.components[0]

        if (interaction.user.id == '323281577956081665') return message.delete()

        if (components[1].label === 'Rejeitar') {

            if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
                return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
            }

            embed.addFields(message.embeds[0].fields, { name: 'Diretores Contra', value: `<@${interaction.user.id}>` })

            row.addComponents(
                components[0],
                new MessageButton()
                    .setCustomId('up_recusado')
                    .setLabel(`Rejeitar 1/${DiretorNumber}`)
                    .setStyle('PRIMARY'),
            )


        } else {
            let RejeitarVoteValue = components[1].label.replace('Rejeitar ', '')

            if (message.embeds[0].fields.find(m => m.value.includes(interaction.user.id))) {
                return interaction.reply({ content: 'Você não pode reagir de novo!!!', ephemeral: true })
            }
            if (RejeitarVoteValue === `${DiretorNumber}/${DiretorNumber}` || RejeitarVoteValue === `${DiretorNumber - 1}/${DiretorNumber}`) return (
                message.delete(),
                interaction.reply({ content: 'Seu voto foi decisivo!!!', ephemeral: true })

            )

            RejeitarVoteValue = RejeitarVoteValue.replace(RejeitarVoteValue.charAt(0), Number(RejeitarVoteValue.charAt(0)) + 1)

            const embedField = message.embeds[0].fields.map(m => {
                if (m.name == 'Diretores Contra') {
                    m = { name: 'Diretores Contra', value: `${m.value}, <@${interaction.user.id}>` }
                }

                return m
            })

            embed.addFields(embedField)


            row.addComponents(
                components[0],
                new MessageButton()
                    .setCustomId('up_recusado')
                    .setLabel(`Rejeitar ${RejeitarVoteValue}`)
                    .setStyle('PRIMARY')
            )

        }


    }

    await message.edit({ embeds: [embed], components: [row] })
    interaction.reply({ content: 'Voto concluído com sucesso!!!', ephemeral: true })
}