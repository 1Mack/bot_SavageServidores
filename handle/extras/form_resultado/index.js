const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { guildsInfo } = require('../../../configs/config_geral')

exports.Form_resultado = async function (interaction, client) {
    const resultChannel = interaction.guild.channels.cache.get('935958975558615100')
    let { embeds: msgEmbed, components } = interaction.message
    msgEmbed = msgEmbed[0]


    const msgInfos = {
        discord: `<@${msgEmbed.fields.find(m => m.name.includes('ID')).value}>`,
        servidor: await msgEmbed.fields.find(m => m.name.includes('Servidor')).value,
        steamID: null,
        steamLink: await msgEmbed.fields.find(m => m.name.includes('Link do Perfil')).value,
        ajudara_mensal: msgEmbed.fields.find(m => m.name.includes('Ajudará Mensalmente?')).value,
        mensalMoney: {
            date: null,
            value: null
        },
        age: await msgEmbed.fields.find(m => m.name.includes('Idade')).value,
    }
    msgEmbed.title = 'Sendo Averiguado'
    components[0].components[0].disabled = true

    interaction.message.edit({ embeds: [msgEmbed], components: [components[0]] })

    await interaction.guild.channels.create(`recrutando→${interaction.user.id}`, {
        type: 'text',
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL'],
            },
        ],
        parent: '936310042225934408',
    }).then(async channel => {
        interaction.reply({ content: `[Canal criado sucesso](https://discord.com/channels/${guildsInfo.main}/${channel.id})`, ephemeral: true })

        const msg = await channel.send(`${interaction.user}`)

        let filter = i => {
            i.deferUpdate();
            return i.user.id == interaction.user.id && i.channelId == channel.id;
        };

        const rowFirstAprove = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('verform_resultado_channel_aprovado')
                    .setLabel('Aprovar')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('verform_resultado_channel_reprovado')
                    .setLabel('Reprovar')
                    .setStyle('DANGER'),

            );

        await msg.edit({ content: '<:blank:773345106525683753>', components: [rowFirstAprove] })

        const resultEmbed = new MessageEmbed()
        const resultButton = new MessageActionRow()

        let loopBool = true,
            boolError = false

        await channel
            .awaitMessageComponent({ filter, time: 600000, errors: ['time'] })
            .then(async ({ customId }) => {

                filter = (m) => m.author.id === interaction.user.id && m.channel.id === channel.id;

                if (customId == 'verform_resultado_channel_reprovado') {
                    await msg.edit({ content: 'Qual o motivo dele ter sido reprovado?', components: [] })

                    await channel
                        .awaitMessages({
                            filter,
                            max: 1,
                            time: 600000,
                            errors: ['time'],
                        })
                        .then(async (collected) => {
                            collected = collected.first()

                            collected.delete()

                            resultEmbed
                                .setColor('ff0000')
                                .addFields(
                                    { name: 'Discord', value: msgInfos.discord.toString() },
                                    { name: 'Idade', value: msgInfos.age.toString() },
                                    { name: 'Servidor', value: msgInfos.servidor.toString() },
                                    { name: 'Link do Perfil', value: msgInfos.steamLink.toString() },
                                    { name: 'Ajudará Mensalmente?', value: msgInfos.ajudara_mensal },
                                    { name: 'Motivo da Reprovação', value: collected.content }
                                )
                                .setFooter({ text: `Reprovado pelo ${interaction.user.username}` })
                                .setTimestamp();
                            let guildRole = await interaction.guild.roles.cache.find(r => r.name == `Entrevista | ${msgInfos.servidor.toUpperCase()}`)
                            interaction.guild.members.cache.get(msgInfos.discord.replace(/[<@>]/g, '')).roles.remove(guildRole).catch(() => { })

                            resultButton
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('verform_resultado_reprovado_rever')
                                        .setLabel('Revogar Reprovação')
                                        .setStyle('DANGER')
                                );

                        }).catch(() => {
                            boolError = true
                        })

                } else {

                    const embed = new MessageEmbed()
                        .setColor('36393f')
                        .setDescription(`${interaction.user.username}, você tem 10 minutos para responder cada pergunta
            
                        > **Qual a STEAMID do entrevistado?** [Clique aqui para abrir o site onde pega](https://steamid.io/)
                        
                        **Ele disse que o link do perfil dele era esse:** __${msgInfos.steamLink}__

                        ***Exeplo de STEAMID: *** __STEAM_1:1:79461554___
                        `);

                    do {
                        await msg.edit({ embeds: [embed], components: [], content: ' ' })

                        await channel
                            .awaitMessages({
                                filter,
                                max: 1,
                                time: 600000,
                                errors: ['time'],
                            })
                            .then(async (collected) => {
                                collected = collected.first()

                                collected.delete()

                                if (!collected.content.includes('STEAM_'))
                                    return await channel.send({ content: 'Você digitou a steamid errada!!!!\n**Exemplo de STEAMID:** __STEAM_1:1:79461554___', embeds: [] })
                                        .then(m => setTimeout(() => {
                                            m.delete()
                                        }, 6000))


                                msgInfos.steamID = collected.content

                                return loopBool = false;

                            }).catch(() => {
                                boolError = true
                                loopBool = false;
                            })

                    } while (loopBool);


                    embed.setDescription(`${interaction.user.username}, você tem 10 minutos para responder cada pergunta
            
                    > **Quando ele irá ajudar mensalmente e qual valor?**

                    ***Formato correto: *** __dd/mm/aaaa - valor___
                    ***Exemplo: *** 15/02/2022 - 20


                    ***OBS***: **ESCREVA ATENTAMENTE, NAO ERRE ISSO, POIS PODE BUGAR!!**
            
                    `);

                    if (['sim', 's', 'depende'].includes(msgInfos.ajudara_mensal.toLowerCase())) {
                        loopBool = true
                        do {
                            await msg.edit({ embeds: [embed], content: ' ' })

                            await channel
                                .awaitMessages({
                                    filter,
                                    max: 1,
                                    time: 600000,
                                    errors: ['time'],
                                })
                                .then(async (collected) => {
                                    collected = collected.first()
                                    collected.delete()
                                    collected = collected.content
                                    if (collected.indexOf(' - ') == -1 || collected.substring(0, collected.indexOf(' - ')).length != 10) {
                                        return await channel.send({ content: 'Você digitou o formato errado!!!!\n**Formato Correto:** DD/MM/AAAA', embeds: [] })
                                            .then(m => setTimeout(() => {
                                                m.delete()
                                            }, 6000))
                                    }

                                    msgInfos.mensalMoney.value = collected.substring(collected.lastIndexOf(' ') + 1, collected.length)

                                    msgInfos.mensalMoney.date = collected.substring(0, collected.indexOf(' - '))

                                    return loopBool = false;

                                }).catch(() => {
                                    boolError = true
                                    loopBool = false;
                                })

                        } while (loopBool);
                    }


                    if (msgInfos.steamID.startsWith('STEAM_0')) {
                        msgInfos.steamID = msgInfos.steamID.replace('0', '1');
                    }

                    resultEmbed
                        .setColor('F0FF00')
                        .addFields(
                            { name: 'Discord', value: msgInfos.discord.toString() },
                            { name: 'Idade', value: msgInfos.age.toString() },
                            { name: 'Servidor', value: msgInfos.servidor.toString() },
                            { name: 'Link do Perfil', value: msgInfos.steamLink.toString() },
                            { name: 'SteamID', value: msgInfos.steamID.toString() },
                            { name: 'Ajudará Mensalmente?', value: msgInfos.mensalMoney.value == null ? 'Não' : `${msgInfos.mensalMoney.date} - ${msgInfos.mensalMoney.value}` },
                        )
                        .setFooter({ text: `Aprovado pelo ${interaction.user.username}` })
                        .setTimestamp();
                    resultButton
                        .addComponents(
                            new MessageButton()
                                .setCustomId('verform_resultado_aprovado')
                                .setLabel('Aprovar')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('verform_resultado_reprovado')
                                .setLabel('Reprovar')
                                .setStyle('DANGER'),

                        );

                }
            }).catch(() => {
                boolError = true
            })

        if (boolError) {
            await channel.bulkDelete(50)
            channel.send('Você nao respondeu a tempo ou houve algum erro inesperado, deletando canal...')
            components[0].components[0].disabled = false
            msgEmbed.title = 'Novo Candidato'
            interaction.message.edit({ components: [components[0]], embeds: [msgEmbed] })

            return (
                setTimeout(() => {
                    channel.delete()
                }, 10000)
            )
        }



        await msg.edit({ content: '**Averiguação concluída, sala de Recrutamento sendo excluída em 10s!**', embeds: [] })

        msgEmbed.title = 'Averiguado com Sucesso'
        interaction.message.edit({ embeds: [msgEmbed] })
        resultChannel.send({ components: [resultButton], embeds: [resultEmbed] })

        setTimeout(() => {
            channel.delete()
        }, 10000)

    })

}