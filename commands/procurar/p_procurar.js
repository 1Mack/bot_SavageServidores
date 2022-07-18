const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { serversInfos, serverGroups } = require('../../configs/config_geral');
const { connection2 } = require('../../configs/config_privateInfos');
const { GerenteError, InternalServerError } = require('../../embed/geral');
const { SteamIdNotFound } = require('./embed');
const chalk = require('chalk');

module.exports = {
  name: 'procurar',
  description: 'Ver o cargo de um staff atrabés do @ dele',
  options: [{ name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolher um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.serverNumber.toString() } }) },
  { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'steamid do Player', required: false, choices: null }],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let steamid = interaction.options.getString('steamid'),
      servidor = interaction.options.getString('servidor').toLowerCase()

    if (steamid) {
      if (steamid.startsWith('STEAM_0')) {
        steamid = steamid.replace('0', '1');
      }
    }
    const serversInfosFound = serversInfos.find(m => m.serverNumber == servidor);

    if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole))
      return interaction.reply({ embeds: [GerenteError(interaction)], ephemeral: true })

    let rows;
    const con = connection2.promise();

    try {
      [rows] = await con.query(
        `select * from Cargos where ${steamid != undefined ? `playerid regexp "${steamid.slice(8)}" AND ` : ''
        }(server_id = "${servidor}" OR server_id = "0") ORDER BY flags ASC`
      );
    } catch (error) {
      return (
        interaction.reply({ embeds: [InternalServerError(interaction)], ephemeral: true }),
        console.error(chalk.redBright('Erro no Select'), error)
      );
    }
    if (rows == '') {
      return interaction.reply({ embeds: [SteamIdNotFound(interaction, steamid)], ephemeral: true })
    }

    await interaction.deferReply()

    await interaction.followUp({ content: `**${interaction.user} | Estou te enviando os sets no seu privado do servidor ${serversInfosFound.visualName}!**` })

    rows = rows.sort((a, b) => (
      Object.keys(serverGroups).findIndex(key => serverGroups[key].value == `${a.flags}`)
      >
      Object.keys(serverGroups).findIndex(key => serverGroups[key].value == `${b.flags}`)
    ) ? 1 : -1)

    rows = await rows.map((item) => {

      let cargo = Object.keys(serverGroups).find(key => serverGroups[key].value == `${item.flags}`)


      return (
        [
          { name: '\u200B', value: `${item.playerid}${item.discordID ? ` (${item.discordID})` : ''}`, inline: true },
          { name: '\u200B', value: `${cargo == undefined ? 'VIP' : cargo.toUpperCase()}`, inline: true },
          { name: '\u200B', value: `${new Date(item.timestamp.toString()).toLocaleDateString()}/${new Date(item.enddate.toString()).toLocaleDateString()}`, inline: true }
        ]
      )
    });

    let logStaffFind = new EmbedBuilder().addFields(
      { name: `${serversInfosFound.visualName} - STEAMID`, value: '\u200B', inline: true },
      { name: 'CARGO', value: '\u200B', inline: true },
      { name: 'DATA', value: '\u200B', inline: true },
    )
    for (let i in rows) {
      logStaffFind.addFields(
        rows[i]
      )
      if (logStaffFind.fields.length == 24 || i == rows.length - 1) {
        await interaction.user.send({ embeds: [logStaffFind] });
        logStaffFind.fields = []
      }

    }
    interaction.editReply({ content: `Todos os sets foram enviados no seu pv!` }).then(m => setTimeout(() => {
      m.delete()
    }, 5000))
  },
};
