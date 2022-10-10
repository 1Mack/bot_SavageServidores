const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');
const { ComponentType } = require('discord.js')
const { connection2 } = require('../../../configs/config_privateInfos');
const { NotTarget, SetAskConfirm, SetSuccess, vipSendMSG, logVip } = require('./embed');
const {
  GerenteError,
  PlayerDiscordNotFound,
  InternalServerError,
} = require('../../../embed/geral');
const chalk = require('chalk');
const { ReloadRolesAndTags } = require('../../../handle/checks/reloadRolesAndTags');


exports.Comprado = async function (client, interaction, discord1, steamid, cargo, tempo, servidor, extra) {

  await interaction.deferReply()

  try {
    if (steamid.startsWith('STEAM_0')) {
      steamid = steamid.replace('0', '1');
    }

    if (steamid == 'STEAM_1:1:79461554' && interaction.user.id !== '323281577956081665')

      return interaction.followUp({ embeds: [NotTarget(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));


    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (
      !interaction.member._roles.find(m => m == '831219575588388915')
    )
      return interaction.followUp({ embeds: [GerenteError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

    let dataInicial = Date.now();
    dataInicial = Math.floor(dataInicial / 1000);
    let dataFinal = 0,
      DataFinalUTC = 0;

    if (tempo !== 0) {
      dataFinal = dataInicial + tempo * 86400;
      DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');
    }
    let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


    let fetchedUser
    try {
      fetchedUser = await interaction.guild.members.cache.get(discord1.id);
    } catch (error) {
      return interaction.followUp({ embeds: [PlayerDiscordNotFound(interaction)], ephemeral: true })
    }

    let guild = client.guilds.cache.get(guildsInfo.log);

    const canal = guild.channels.cache.get('954374435622760508')

    let rows;
    const con = connection2.promise();

    if (serversInfosFound) {

      try {
        [rows] = await con.query(
          `select * from Cargos where playerid like "%${steamid.slice(8)}" AND server_id = "${serversInfosFound.serverNumber}"`
        );
      } catch (error) {
        return (
          interaction.followUp({ embeds: [InternalServerError(interaction)], ephemeral: true }),
          console.error(chalk.redBright('Erro no Select'), error)
        );
      }
    }

    let opa;

    if (serversInfosFound && rows != '' && rows.find(row => Object.keys(serverGroups).find(key => serverGroups[key].value === row.flags) == cargo)) {

      let msgFunction = SetAskConfirm(interaction)

      await interaction.followUp({ embeds: [msgFunction.embed], components: [msgFunction.button] }).then(async (m) => {

        const filter = i => {
          i.deferUpdate();
          return i.user.id === interaction.user.id;
        };

        await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 })
          .then(async ({ customId }) => {

            if (customId == 'nao') {

              return (opa = interaction.editReply({ content: '**Abortando Comando** <a:savage_loading:837104765338910730>', embeds: [] })
                .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
            } else {
              return (opa = 's');

            }
          })
          .catch(() => {
            return (opa = interaction.editReply({
              content:
                '**Você não respondeu a tempo!!! lembre-se, você tem apenas 15 segundos para responder!** \n***Abortando Comando*** <a:savage_loading:837104765338910730>',
              embeds: []
            })
              .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
          });
        m.delete()
      });
    }

    try {
      if (opa === 's' && serversInfosFound) {
        await con.query(
          `UPDATE Cargos SET 
                    discordID = '${discord1.id}', 
                    flags = '${serverGroups[cargo].value}', 
                    enddate = (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${tempo == 0 ? '3850' : tempo} DAY))
                    WHERE (playerid regexp '${steamid.slice(8)}') AND server_id = "${serversInfosFound.serverNumber}"`
        );
      } else if (opa === undefined) {
        await con.query(`
                    INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
                    VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${tempo == 0 ? '3850' : tempo} DAY)), '${serverGroups[cargo].value}', ${serversInfosFound ? `${serversInfosFound.serverNumber}` : '0'}, '${discord1.id}')
                `
        );
      } else return opa;
    } catch (error) {
      return (
        interaction.editReply({ embeds: [InternalServerError(interaction)], ephemeral: true }),
        console.error(chalk.redBright('Erro no Insert'), error)
      );
    }

    ReloadRolesAndTags(serversInfosFound.identifier)


    interaction.editReply({ embeds: [SetSuccess(interaction, fetchedUser.user, cargo)], ephemeral: true })
      ||
      interaction.followUp({ embeds: [SetSuccess(interaction, fetchedUser.user, cargo)], ephemeral: true })
    if (cargo != 'vip') {
      try {
        if (serversInfosFound && fetchedUser) {
          if (!fetchedUser.roles.cache.has(serversInfosFound.tagComprado)) {
            fetchedUser.roles.add(serversInfosFound.tagComprado)
          }
          if (!fetchedUser.roles.cache.has('722814929056563260')) {
            fetchedUser.roles.add('722814929056563260')
          }

          if (!fetchedUser.user.username.includes('Savage |')) {
          }
        } else {
          fetchedUser.roles.add(serversInfos.map(m => m.tagComprado).concat('722814929056563260'))
        }
        fetchedUser.setNickname('Savage | ' + fetchedUser.user.username);


      } catch (error) {
        interaction.followUp({ content: `${interaction.user} **| Não consegui setar o cargo/Renomear o player, faça isso manualmente!!**`, ephemeral: true })
        console.log(error)
      }
    }
    canal.send({ embeds: [logVip(fetchedUser.user, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, servidor, extra, interaction)] });
    fetchedUser.send({ embeds: [vipSendMSG(fetchedUser.user, cargo, tempo, servidor)] });
  } catch (err) {
    console.log(err)

  }
}