const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');
const { NotTarget, SetSuccess, vipSendMSG, logVip } = require('./embed');
const {
  GerenteError,
  PlayerDiscordNotFound,
  InternalServerError,
} = require('../../../embed/geral');
const chalk = require('chalk');
const { ReloadRolesAndTags } = require('../../../handle/checks/reloadRolesAndTags');
const { CheckDatabaseRole } = require('../../../handle/checks/checkDatabaseRole');


exports.Comprado = async function (client, interaction, discord1, steamid, cargo, tempo, servidor, extra) {

  if (steamid['erro']) return interaction.reply({ content: steamid.erro, ephemeral: true })


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

    let dataInicial = Math.floor(Date.now() / 1000);
    let DataFinalUTC = 0;

    if (tempo !== 0) {
      DataFinalUTC = new Date((dataInicial + tempo * 86400) * 1000).toLocaleDateString('en-GB');
    }
    let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


    let fetchedUser
    try {
      fetchedUser = await interaction.guild.members.cache.get(discord1.id);
    } catch (error) {
      return interaction.followUp({ embeds: [PlayerDiscordNotFound(interaction)], ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))
    }

    let guild = client.guilds.cache.get(guildsInfo.log);

    const canal = guild.channels.cache.get('954374435622760508')

    try {
      await CheckDatabaseRole(steamid, serversInfosFound ? serversInfosFound.serverNumber : '0', true, serverGroups[cargo].value, tempo, discord1.id)
    } catch (error) {
      interaction.editReply({ embeds: [InternalServerError(interaction)], ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))
      return console.error(chalk.redBright('Erro no Insert'), error)
    }

    serversInfosFound == undefined ? serversInfos.forEach(servers => {
      ReloadRolesAndTags(servers.identifier)
    }) : ReloadRolesAndTags(serversInfosFound.identifier)

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