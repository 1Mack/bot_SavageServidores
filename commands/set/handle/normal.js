const { EmbedBuilder, ComponentType } = require('discord.js');
const { connection2 } = require('../../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');

const { NotTarget, SetSuccess, isDono, staffSendAllMSG, SetAskConfirm } = require('./embed');
const { PlayerDiscordNotFound, InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');
const { ReloadRolesAndTags } = require('../../../handle/checks/reloadRolesAndTags');
const { CheckDatabaseRole } = require('../../../handle/checks/checkDatabaseRole');


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
    return interaction.followUp({ embeds: [NotTarget(interaction)], ephemeral: true }).then(() => setTimeout(() => {
      interaction.webhook.deleteMessage('@original')
    }, 5000))


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

  const con = connection2.promise();
  try {

    await CheckDatabaseRole(steamid, serversInfosFound ? serversInfosFound.serverNumber : '0', false, serverGroups[cargo].value, '3650', discord1.id)
  } catch (error) {
    interaction.editReply({ embeds: [InternalServerError(interaction)], ephemeral: true })
    return console.error(chalk.redBright('Erro no Insert'), error)
  }

  serversInfosFound == undefined ? serversInfos.forEach(servers => {
    ReloadRolesAndTags(servers.identifier)
  }) : ReloadRolesAndTags(serversInfosFound.identifier)


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