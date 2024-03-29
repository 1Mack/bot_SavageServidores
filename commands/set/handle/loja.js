const chalk = require("chalk");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, WebhookClient, ButtonStyle } = require("discord.js");
const { serverGroups, serversInfos, guildsInfo } = require("../../../configs/config_geral");
const { connection2 } = require("../../../configs/config_privateInfos");
const { webhookSavageStore } = require("../../../configs/config_webhook");
const { InternalServerError } = require("../../../embed/geral");
const { Desbanir_approve } = require("../../ban/handle/desbanirHandle/desbanir_approve");
const { CriarServidor } = require("./criar");
const webhookSavageLogs = new WebhookClient({ id: webhookSavageStore.id, token: webhookSavageStore.token });

exports.Comprado_Loja = async function (client, interaction, discord, servidor, idOrSteam) {

  let embedLogCompra = await client.guilds.cache.get(guildsInfo.log).channels.cache.get('954374435622760508').messages.fetch()


  if (idOrSteam['erro']) return interaction.reply({ content: idOrSteam.erro, ephemeral: true })

  idOrSteam.includes('STEAM') ? idOrSteam = idOrSteam.slice(8) : idOrSteam
  embedLogCompra = embedLogCompra.filter(msg =>
    msg.embeds[0].fields.find(f => f.name.includes(idOrSteam)) &&
    msg.embeds[0].fields.find(f => f.name.includes('Resgatado'))
  )

  if (embedLogCompra.size == 0) return interaction.reply({ content: 'Não encontrei nenhum registro!', ephemeral: true }).then(() => setTimeout(() => {
    interaction.webhook.deleteMessage('@original')
  }, 5000))

  let cont = 0

  const embed = new EmbedBuilder().setColor('36393f').setDescription(`**Achei ${embedLogCompra.size} registros de compras, escolha para qual você quer setar o player**

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
  const button = new ActionRowBuilder().addComponents(
    embedLogCompra.map((msg, i) => {
      cont++
      return new ButtonBuilder()
        .setCustomId(`${i}`)
        .setLabel(cont.toString())
        .setStyle(ButtonStyle.Primary)
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

        return new ButtonBuilder()
          .setCustomId(`${embedLogCompraFields[msg].name.slice(-1)}`)
          .setLabel(`${embedLogCompraFields[msg].name.slice(-1)}`)
          .setStyle(ButtonStyle.Primary)
      }))

      msgAsk.edit({ embeds: [embed], components: [button] })

      await interaction.channel
        .awaitMessageComponent({ filter, time: 50000, errors: ['time'] })
        .then(async ({ customId }) => {


          const con = connection2.promise()
          let rows,
            steamid = embedLogCompraFields[embedLogCompraFields.findIndex(f => f.name == 'SteamID') + 1].name,
            pacote = embedLogCompraFields.find(f => f.name == `Pacote ${customId}`).value,
            fields = embedLogCompra.embeds[0].fields,
            EndBool = false

          fields = embedLogCompraFields.filter(f => f.name != `Resgatado ${customId}`)

          let findSteamid = await fields.findIndex(f => f.name == 'SteamID')

          fields.find(f => f.name == `Servidor ${customId}`).value = servidor
          fields[findSteamid].name = 'SteamID/DiscordID'
          fields[findSteamid + 1].name = `${fields[findSteamid + 1].name}/${discord.id}`

          embedLogCompra.embeds[0].data.fields = fields

          if (pacote.includes('¢')) {
            embed.setDescription(`Você selecionou um plano especial, o qual é **${pacote}**\n\nVocê terá 10 minutos para resolver tudo, após isso clique no botão ***Resolvido***`)

            button.setComponents(new ButtonBuilder()
              .setCustomId(`resolvido`)
              .setLabel(`Resolvido`)
              .setStyle(ButtonStyle.Success)
            )

            msgAsk.edit({ embeds: [embed], components: [button] })

            await interaction.channel
              .awaitMessageComponent({ filter, time: 100000, errors: ['time'] })
              .then(() => {
              }).catch(() => {
                EndBool = true
                return msgAsk.edit({ content: 'Você não respondeu a tempo, abortando comando', embeds: [], components: [] }).then(m => setTimeout(() => {
                  m.delete()
                }, 5000))
              })
          } else if (['UNBAN', 'UNMUTE', 'UNGAG'].includes(pacote)) {
            if (pacote == 'UNBAN') {

              await Desbanir_approve(client, interaction, steamid, 'comprou unban', null, true)
            }

          } else {
            let newPacote = pacote.replace(/[()]/g, '').split(' ')

            if (newPacote[0].toUpperCase() === 'ALUGUEL') {
              let criarServidor = await CriarServidor(client, msgAsk, steamid, servidor, discord, newPacote[2])

              if (!criarServidor) return (EndBool = true, msgAsk.edit({ embeds: [InternalServerError(interaction)], components: [] }))
            } else {

              let cargo = { allServers: false }

              if (pacote.toLowerCase().includes('todos')) {
                cargo.allServers = true
                cargo.cargo = Object.keys(serverGroups).find(m => {
                  if (newPacote[0].includes('+')) {
                    return newPacote[0].replace('+', 'PLUSP') == m.toUpperCase()
                  } else if (newPacote[0].toLowerCase().includes('GERENTE')) {
                    return newPacote[0] == m.toUpperCase()
                  } else {
                    return newPacote[0] + 'P' == m.toUpperCase()
                  }
                })
                cargo.tempo = newPacote[1]

              } else {
                cargo.cargo = Object.keys(serverGroups).find(m => {
                  if (newPacote[0].includes('+')) {
                    return newPacote[0].replace('+', 'PLUSP') == m.toUpperCase()
                  } else {
                    return newPacote[0] + 'P' == m.toUpperCase()
                  }
                })
                cargo.tempo = newPacote[1]
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
                    EndBool = true,
                    msgAsk.edit({ embeds: [InternalServerError(interaction)], components: [] }),
                    console.error(chalk.redBright('Erro no Select'), error)
                  );
                }
              }
              let findRow = rows ? rows.find(row => Object.keys(serverGroups).find(key => serverGroups[key].value === row.flags) == cargo.cargo) : undefined

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
                  EndBool = true,
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
          }

          if (EndBool) return;


          webhookSavageLogs.editMessage(embedLogCompra.id, { embeds: [embedLogCompra.embeds[0]] })

          msgAsk.edit({ content: '***Setado/Resolvido com sucesso!!***', embeds: [], components: [] }).then(m => setTimeout(() => {
            m.delete()
          }, 5000))
          interaction.channel.send(`**<@${interaction.channel.topic}> | Você acabou de receber o seu plano. Caso tenha comprado cargo de staff, não se esqueça de olhar as <#714319209580199946> e os <#592397300991655940>**`)
        })
    })
}