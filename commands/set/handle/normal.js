const { EmbedBuilder, ComponentType } = require('discord.js');
const { connection2 } = require('../../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');

const { NotTarget, SetSuccess, isDono, staffSendAllMSG, SetAskConfirm } = require('./embed');
const { PlayerDiscordNotFound, InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');
const { ReloadRolesAndTags } = require('../../../handle/checks/reloadRolesAndTags');


exports.Staff = async function (client, interaction, discord1, steamid, cargo, servidor, extra) {
  await interaction.deferReply()

  if (!interaction.member.roles.cache.has('831219575588388915')) return (
    interaction.followUp({ content: 'Voce não pode usar esse comando' })
  )

  if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
    steamid = steamid.replace('STEAM_0', 'STEAM_1');
  }

  if (
    (steamid == 'STEAM_1:1:79461554' || ['fundador', 'diretor', 'gerente'].includes(cargo)) &&
    interaction.user.id !== '323281577956081665'
  )
    return interaction.followUp({ embeds: [NotTarget(interaction)], ephemeral: true })


  const serversInfosFound = serversInfos.find((m) => m.name === servidor);

  let fetchedUser
  try {
    fetchedUser = await interaction.guild.members.cache.get(discord1.id);
  } catch (error) {
    return interaction.followUp({ embeds: [PlayerDiscordNotFound(interaction)], ephemeral: true })
  }

  let logStaff = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(fetchedUser.user.username.toString())
    .addFields(
      { name: 'Discord', value: discord1.toString() },
      { name: 'Steamid', value: steamid },
      { name: 'Cargo', value: cargo },
      { name: 'Servidor', value: servidor },
      { name: 'Observações', value: extra }
    )
    .setTimestamp()
    .setFooter({ text: `Setado Pelo ${interaction.user.username}` });



  let guild = client.guilds.cache.get(guildsInfo.log);

  const canal = guild.channels.cache.find((channel) => channel.id === '792576052144373760');

  let rows;
  const con = connection2.promise();
  if (serversInfosFound) {
    try {
      [rows] = await con.query(
        `select * from Cargos where playerid regexp "${steamid.slice(8)}" AND server_id = "${serversInfosFound.serverNumber}"`
      );
    } catch (error) {
      return (
        interaction.followUp({ embeds: [InternalServerError(interaction)], ephemeral: true }),
        console.error(chalk.redBright('Erro no Select'), error)
      );
    }
  }
  let opa = undefined;
  if (rows != '') {

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

  let dataInicial = Date.now();
  dataInicial = Math.floor(dataInicial / 1000);

  try {
    if (opa === 's' && !serverGroups[cargo].value.endsWith('p') && serverGroups[cargo].value != 'vip' && serversInfosFound) {
      await con.query(
        `UPDATE Cargos SET 
                discordID = '${discord1.id}', 
                flags = '${serverGroups[cargo].value}'
                WHERE playerid regexp '${steamid.slice(8)}' AND server_id = '${serversInfosFound.serverNumber}'`
      );
    } else if (opa === undefined || serverGroups[cargo].value.endsWith('p') || serverGroups[cargo].value != 'vip') {
      await con.query(`
                INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
                VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3650 DAY)), '${serverGroups[cargo].value}', '${serversInfosFound ? `${serversInfosFound.serverNumber}` : '0'}', '${discord1.id}')
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


  interaction.editReply({ embeds: [SetSuccess(interaction, fetchedUser.user, cargo)] }).then(m => setTimeout(() => {
    m.delete()
  }, 5000))

  try {

    if (serversInfosFound) {
      if (!fetchedUser.roles.cache.has(serversInfosFound.tagDoCargo)) {
        fetchedUser.roles.add(serversInfosFound.tagDoCargo)
      }
      if (!fetchedUser.roles.cache.has('722814929056563260')) {
        fetchedUser.roles.add('722814929056563260')
      }
      let formRole = await fetchedUser.roles.cache.find(m => m.name == `Entrevista | ${(servidor).toUpperCase()}`)

      if (formRole) {
        fetchedUser.roles.remove(formRole)
      }

    } else {
      fetchedUser.roles.add(serversInfos.map(m => m.tagDoCargo).concat('722814929056563260'))

    }

  } catch (error) {
    interaction.followUp({ content: `${interaction.user} **| Não consegui setar o cargo do player, faça isso manualmente!!**` })
  }


  fetchedUser.setNickname('Savage | ' + fetchedUser.user.username).catch(() => { })

  canal.send({ embeds: [logStaff] });
  client.channels.cache.get('710288627103563837').send({ embeds: [staffSendAllMSG(fetchedUser.user, cargo, servidor)] });

  return true;
}