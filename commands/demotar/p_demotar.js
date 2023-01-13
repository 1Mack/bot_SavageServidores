const { EmbedBuilder, ApplicationCommandOptionType, ComponentType } = require('discord.js')
const { connection2 } = require('../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

const {
  MackNotTarget,
  SteamidNotFound,
  DemotedLog,
  DemotedSendMSG,
  DemotedAskConfirm,
  DemotedInfo,
} = require('./embed');
const { InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');
module.exports = {
  name: 'demotar',
  description: 'Demotar algéum do servidor',
  options: [
    { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo do Demoted', required: true, choices: null },
    { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'steamid do player', required: false, choices: null },
    { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: false, choices: null },
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let steamid = interaction.options.getString('steamid'),
      discord = interaction.options.getUser('discord'),
      extra = interaction.options.getString('motivo');

    await interaction.deferReply()

    if (!steamid && !discord) return interaction.followUp('Você deve fornecer a steamid ou o discord').then(() => setTimeout(() => interaction.deleteReply(), 10000));

    if (steamid) {
      if (steamid.startsWith('STEAM_0')) {
        steamid = steamid.trim().replace('STEAM_0', 'STEAM_1');
      } else {
        steamid = steamid.trim()
      }

      if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')
        return interaction.followUp({ embeds: [MackNotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

    }

    const con = connection2.promise();
    let rows

    try {

      if (!steamid) {
        [rows] = await con.query(
          `SELECT * from Cargos 
                      where playerid regexp 
                      REPLACE(
                          (select playerid from Cargos where discordID = '${discord.id}' LIMIT 1), 
                          SUBSTRING(
                              (select playerid from Cargos where discordID = '${discord.id}' LIMIT 1), 
                              1, 8), 
                              ''
                          )
                  `
        );
      } else {
        [rows] = await con.query(
          `select * from Cargos where playerid regexp '${steamid.slice(8)}'`
        );

      }
    }
    catch (error) {
      return (
        interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
        console.error(chalk.redBright('Erro no Select'), error)
      );
    }

    if (rows == '') {
      return interaction.followUp({ embeds: [SteamidNotFound(interaction, steamid)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }

    let serversInfosFound = rows.map(row => {
      let serverFind = serversInfos.find(m => m.serverNumber == row.server_id)

      let cargo = Object.keys(serverGroups).find(key => serverGroups[key].value === row.flags)

      return { row, serverFind, cargo }
    })
    const discordUser = rows.find(dc => dc.discordID != null) || { discordID: discord.id }

    let msgFunction;

    msgFunction = DemotedInfo(serversInfosFound, steamid)

    let msg = await interaction.followUp({ embeds: [msgFunction.embed], components: [msgFunction.selectMenu] })


    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.SelectMenu, time: 60000 })
      .then(async ({ values }) => {

        serversInfosFound = await serversInfosFound.filter(info => {
          if (info['serverFind']) {
            return values.find(m => {
              let [a, b] = m.split('-')

              return a == info.serverFind.serverNumber.toString() && b == info.cargo
            })


          } else {
            return values.find(m => {
              let [a, b] = m.split('-')

              return a == info.row.server_id.toString() && b == info.cargo
            })
          }
        })

        msgFunction = DemotedAskConfirm(interaction)


        await msg.edit({ embeds: [msgFunction.embed], components: [msgFunction.button] })

        await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 })
          .then(async ({ customId }) => {

            if (customId == 'nao') {

              return (
                msg.edit({ content: '**Abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
                await wait(3000),
                msg.delete()
              )
            } else {
              try {
                if (steamid) {

                  await con.query(
                    `DELETE FROM Cargos WHERE playerid regexp '${steamid.slice(8)}' and 
                                       (${serversInfosFound.map(server =>
                      `server_id = '${server.serverFind ? server.serverFind.serverNumber : server.row.server_id}' and flags = '${serverGroups[server.cargo].value}'`
                    ).join(' or ')})
                                       `
                  );
                } else {
                  await con.query(`DELETE FROM Cargos 
                  WHERE Id IN (
                    SELECT c.Id FROM (
                    SELECT Id from Cargos 
                    where playerid regexp 
                    REPLACE(
                        (select playerid from Cargos where discordID = '${discord.id}' LIMIT 1), 
                        SUBSTRING(
                            (select playerid from Cargos where discordID = '${discord.id}' LIMIT 1), 
                            1, 8), 
                            ''
                      ) AND (${serversInfosFound.map(server =>
                    `server_id = '${server.serverFind ? server.serverFind.serverNumber : server.row.server_id}' and flags = '${serverGroups[server.cargo].value}'`
                  ).join(' or ')})
                    ) as c
                  )
              `)
                }
              } catch (error) {
                return (
                  msg.edit({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => msg.delete(), 10000)),
                  console.error(chalk.redBright('Erro no Delete'), error)
                );
              }
              let fetchedUser;

              if (discordUser != '') {
                fetchedUser = await interaction.guild.members.cache.get(discordUser.discordID);
              }

              serversInfosFound.forEach(async item => {

                if (item.cargo != 'vip') {

                  const DemotedMsgAll = new EmbedBuilder()
                    .setColor('ff0000')
                    .setTitle('***Staff Demotado***')
                    .addFields(
                      { name: 'Jogador', value: fetchedUser ? fetchedUser.user.toString() : 'Indefinido' },
                      { name: 'Cargo', value: item.cargo.toUpperCase() },
                      { name: 'Servidor', value: item.serverFind ? item.serverFind.name.toUpperCase() : 'Desconhecido' }
                    )
                    .setFooter({ text: `Demotado pelo ${interaction.user.username}` })
                    .setTimestamp();

                  client.channels.cache.get('710288627103563837').send({ embeds: [DemotedMsgAll] })
                }

                client.guilds.cache.get(guildsInfo.log).channels.cache.get('792576104681570324').send({ embeds: [DemotedLog(fetchedUser ? fetchedUser.user : 'Indefinido', item.row.playerid, extra, interaction, item.serverFind ? item.serverFind.name : 'Desconhecido ou TODOS')] });

                if (fetchedUser)
                  fetchedUser.send({ embeds: [DemotedSendMSG(fetchedUser ? fetchedUser.user : 'Indefinido', item.row.playerid, item.serverFind ? item.serverFind.name : 'desconhecido', extra)] }).catch(() => { })



              })


              await msg.edit(
                {
                  content: `**${interaction.user} | ${fetchedUser ? fetchedUser.user : steamid} Demotado com sucesso ${serversInfosFound.size > 1 ? 'dos servidores' : 'do servidor'} ${serversInfosFound.map(m => m.serverFind ? `${m.serverFind.visualName} (${m.cargo})` : `desconhecido (${m.cargo})`)}!!**`,
                  embeds: [], components: []
                })

              setTimeout(() => {
                msg.delete()
              }, 5000);

              if (fetchedUser) {


                /*  let findStaffRoles = await rows.filter(m => m.flags != 'a/t' && values.includes(m.server_id)).map(m => m.server_id),
                     rolesToRemove = []
 
                 if (findStaffRoles.length) {
                     let staffRoles = serversInfosFound.filter(m => findStaffRoles.includes(m.serverNumber)).flatMap(m => [m.tagComprado, m.tagDoCargo]),
                         staffAllRoles = fetchedUser._roles.filter(m => serversInfos.flatMap(f => [f.tagComprado, f.tagDoCargo]).includes(m))
 
                     if (staffAllRoles.length == 1 && staffAllRoles.find(m => staffRoles.includes(m))) {
 
                         rolesToRemove.push(staffRoles, '722814929056563260')
 
                         if (fetchedUser.nickname.includes('Savage')) {
                             fetchedUser.setNickname(fetchedUser.user.username).catch(() => { });
                         }
 
                     } else {
 
                         rolesToRemove.push(staffRoles)
                     }
                 }
 
                 await fetchedUser.roles.remove(rolesToRemove.flatMap(m => m)) */
              }


            }

          }).catch(async (err) => {
            return (
              console.log(err),
              msg.edit({ content: '**Não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
              await wait(4000),
              msg.delete()
            )
          })
      }).catch(async (err) => {
        return (
          console.log(err),

          msg.edit({ content: '**Não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>**', embeds: [], components: [] }),
          await wait(4000),
          msg.delete()
        )
      })



  },
};
