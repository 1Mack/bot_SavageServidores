const chalk = require("chalk");
const { MessageEmbed, MessageActionRow, MessageButton, WebhookClient } = require("discord.js");
const { serverGroups, serversInfos, guildsInfo } = require("../../../configs/config_geral");
const { connection2 } = require("../../../configs/config_privateInfos");
const { webhookSavageStore } = require("../../../configs/config_webhook");
const { InternalServerError } = require("../../../embed/geral");
const { Desbanir } = require("../../ban/handle/desbanir");
const webhookSavageLogs = new WebhookClient({ id: webhookSavageStore.id, token: webhookSavageStore.token });

exports.Comprado_Loja = async function (client, interaction, discord, servidor, idOrSteam) {

    let embedLogCompra = await client.guilds.cache.get(guildsInfo.log).channels.cache.get('954374435622760508').messages.fetch()


    idOrSteam.includes('STEAM') ? idOrSteam = idOrSteam.slice(8) : idOrSteam
    embedLogCompra = embedLogCompra.filter(msg =>
        msg.embeds[0].fields.find(f => f.name.includes(idOrSteam)) &&
        msg.embeds[0].fields.find(f => f.name.includes('Resgatado'))
    )

    if (embedLogCompra.size == 0) return interaction.reply({ content: 'Não encontrei nenhum registro!', ephemeral: true })


    let cont = 0

    const embed = new MessageEmbed().setColor('36393f').setDescription(`**Achei ${embedLogCompra.size} registros de compras, escolha para qual você quer setar o player**

    ${embedLogCompra.map(({ embeds }) => {
        embeds = embeds[0].fields
        cont++
        return `***Registro __${cont}__***
        
    > **SteamID:** ${embeds[embeds.findIndex(f => f.name == 'SteamID') + 1].name} 
    > **ID da Compra:** ${embeds[embeds.findIndex(f => f.name == 'ID') + 1].name} 
    > **Pacote:** ${embeds.filter(f => f.name.includes(`Pacote`)).map(m => m.value)} 
    > **Servidor:** ${embeds.filter(f => f.name.includes(`Servidor`)).map(m => m.value)} 
    `
    }).join('\n')}
        `)
    cont = 0
    const button = new MessageActionRow().addComponents(
        embedLogCompra.map((msg, i) => {
            cont++
            return new MessageButton()
                .setCustomId(`${i}`)
                .setLabel(cont.toString())
                .setStyle('PRIMARY')
        })

    )
    let msgAsk = await interaction.channel.send({ embeds: [embed], components: [button] })
    const filter = i => {
        i.deferUpdate();
        return i.user.id == interaction.user.id && i.channelId == interaction.channelId;
    };

    await interaction.channel
        .awaitMessageComponent({ filter, time: 50000, errors: ['time'] })
        .then(async ({ customId }) => {
            embedLogCompra = embedLogCompra.find(msg => msg.id == customId)
            let embedLogCompraFields = embedLogCompra.embeds[0].fields

            let findAllSetableFields = await embedLogCompraFields.filter(f => f.name.includes('Resgatado')).map(m => embedLogCompraFields.findIndex(a => a == m))



            embed.setDescription(`ID **${embedLogCompraFields[1].name}** selecionado!!\n\n***Escolha para qual pacote você deseja setar***\n${findAllSetableFields.map(f => {
                return `
                ***Plano ${embedLogCompraFields[f].name.slice(-1)}***
                > **Pacote:** ${embedLogCompraFields[f - 2].value}
                > **Servidor:** ${embedLogCompraFields[f - 1].value == '[null]' ? `${servidor}` : embedLogCompraFields[f - 1].value}`
            })}`)

            button.setComponents(findAllSetableFields.map((msg) => {

                return new MessageButton()
                    .setCustomId(`${embedLogCompraFields[msg].name.slice(-1)}`)
                    .setLabel(`${embedLogCompraFields[msg].name.slice(-1)}`)
                    .setStyle('PRIMARY')
            }))

            msgAsk.edit({ embeds: [embed], components: [button] })

            await interaction.channel
                .awaitMessageComponent({ filter, time: 50000, errors: ['time'] })
                .then(async ({ customId }) => {

                    embedLogCompra.embeds[0].fields = embedLogCompraFields.filter(f => f.name != `Resgatado  ${customId}`)


                    const con = connection2.promise()
                    let rows,
                        steamid = embedLogCompraFields[embedLogCompraFields.findIndex(f => f.name == 'SteamID') + 1].name,
                        pacote = embedLogCompraFields.find(f => f.name == `Pacote ${customId}`).value
                    let EndBool = false
                    if (pacote.includes('¢')) {
                        embed.setDescription(`Você selecionou um plano especial, o qual é **${pacote}**\n\nVocê terá 10 minutos para resolver tudo, após isso clique no botão ***Resolvido***`)

                        button.setComponents(new MessageButton()
                            .setCustomId(`resolvido`)
                            .setLabel(`Resolvido`)
                            .setStyle('SUCCESS')
                        )

                        msgAsk.edit({ embeds: [embed], components: [button] })

                        await interaction.channel
                            .awaitMessageComponent({ filter, time: 100000, errors: ['time'] })
                            .then(() => {
                            }).catch(() => {
                                return EndBool = true
                            })
                    } else if (['UNBAN', 'UNMUTE', 'UNGAG'].includes(pacote)) {
                        if (pacote == 'UNBAN') {

                            await Desbanir(client, interaction, steamid, 'comprou unban')
                        }
                    } else {
                        pacote = pacote.replace(/[()]/g, '').split(' ')
                        let cargo = { allServers: false }
                        if (pacote[0] == '[TODOS]') {
                            cargo.allServers = true
                            cargo.cargo = Object.keys(serverGroups).find(m => pacote[1].replace('+', 'PLUSP') == m.toUpperCase())
                            cargo.tempo = pacote[2]

                        } else {
                            cargo.cargo = Object.keys(serverGroups).find(m => pacote[0].replace('+', 'PLUSP') == m.toUpperCase())
                            cargo.tempo = pacote[1]
                        }

                        cargo.flags = serverGroups[cargo.cargo]




                        let serversInfosFound = serversInfos.find(sv => sv.name == servidor)
                        if (!cargo.allServers) {
                            try {
                                [rows] = await con.query(
                                    `select * from Cargos where playerid like "%${steamid.slice(8)}" AND server_id = "${serversInfosFound.serverNumber}"`
                                );
                            } catch (error) {
                                return (
                                    msgAsk.edit({ embeds: [InternalServerError(interaction)], components: [] }),
                                    console.error(chalk.redBright('Erro no Select'), error)
                                );
                            }
                        }
                        let findRow = rows.find(row => Object.keys(serverGroups).find(key => serverGroups[key].value === row.flags) == cargo.cargo)

                        try {
                            if (!cargo.allServers && findRow && findRow.server_id == serversInfosFound.serverNumber) {
                                await con.query(
                                    `UPDATE Cargos SET 
                                                              discordID = '${discord.id}', 
                                                              flags = '${cargo.flags.value}', 
                                                              enddate = (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${cargo.tempo == 'PERMANENTE' ? '3850' : cargo.tempo} DAY))
                                                              WHERE (playerid regexp '${steamid.slice(8)}') AND server_id = "${serversInfosFound.serverNumber}"`
                                );
                            } else {
                                await con.query(`
                                                              INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
                                                              VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${cargo.tempo == 'PERMANENTE' ? '3850' : cargo.tempo} DAY)), '${cargo.flags.value}', ${!cargo.allServers ? `${serversInfosFound.serverNumber}` : '0'}, '${discord.id}')
                                                          `
                                );
                            }
                        } catch (error) {
                            return (
                                msgAsk.edit({ embeds: [InternalServerError(interaction)], components: [] }),
                                console.error(chalk.redBright('Erro no Select'), error)
                            );
                        }
                        try {
                            let fetchedUser = await interaction.guild.members.cache.get(discord.id);

                            if (!cargo.allServers && fetchedUser) {
                                if (!fetchedUser.roles.cache.has(serversInfosFound.tagComprado)) {
                                    fetchedUser.roles.add(serversInfosFound.tagComprado)
                                }
                                if (!fetchedUser.roles.cache.has('722814929056563260')) {
                                    fetchedUser.roles.add('722814929056563260')
                                }

                                if (!fetchedUser.user.username.includes('Savage |')) {
                                    fetchedUser.setNickname('Savage | ' + fetchedUser.user.username);

                                }
                            } else if (fetchedUser) {
                                fetchedUser.roles.add(serversInfos.map(m => m.tagComprado).concat('722814929056563260'))
                            }

                        } catch (error) {
                            interaction.followUp({ content: `${interaction.user} **| Não consegui setar o cargo/Renomear o player, faça isso manualmente!!**` }).then((m) => setTimeout(() => {
                                m.delete()
                            }, 5000))
                        }
                    }

                    if (EndBool) return msgAsk.edit({ content: 'Você não respondeu a tempo, abortando comando', embeds: [], components: [] }).then(m => setTimeout(() => {
                        m.delete()
                    }, 5000))

                    webhookSavageLogs.editMessage(embedLogCompra.id, { embeds: [embedLogCompra.embeds[0]] })

                    msgAsk.edit({ content: '***Setado/Resolvido com sucesso!!***', embeds: [], components: [] }).then(m => setTimeout(() => {
                        m.delete()
                    }, 5000))
                })
        })
}