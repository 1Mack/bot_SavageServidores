const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const chalk = require('chalk');

const { connection2 } = require('../../configs/config_privateInfos');
const { serversInfos, serverGroups } = require('../../configs/config_geral');

const { InternalServerError } = require('../../embed/geral');

module.exports = {
  name: 'cargos',
  description: 'Ver os cargos do player in-game',
  options: [
    { name: 'discord', type: ApplicationCommandOptionType.User, description: 'Discord do player', required: false, choices: null },
    { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do player', required: false, choices: null }
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let discord_steam = interaction.options.getUser('discord') || interaction.options.getString('steamid')

    if (!discord_steam) return interaction.reply({ content: 'Você precisa informar o discord ou a steamid do player!!', ephemeral: true })

    let StaffFoundEmbed = new EmbedBuilder().setColor('#0099ff')

    let rows;
    const con = connection2.promise();

    try {
      if (typeof (discord_steam) == 'object') {
        [rows] = await con.query(
          `SELECT * from Cargos 
                        where playerid regexp 
                        REPLACE(
                            (select playerid from Cargos where discordID = '${discord_steam.id}' LIMIT 1), 
                            SUBSTRING(
                                (select playerid from Cargos where discordID = '${discord_steam.id}' LIMIT 1), 
                                1, 8), 
                                ''
                            )
                    `
        );
        StaffFoundEmbed.setTitle(`${discord_steam.username}`);

      } else {
        [rows] = await con.query(
          `select * from Cargos 
                where playerid regexp '${discord_steam.slice(8)}'`
        );

        let findDiscordID = await rows.find(row => row.discordID != null)

        if (findDiscordID) {
          StaffFoundEmbed.setTitle(`${(await interaction.guild.members.cache.get(findDiscordID.discordID)).user.username}`)
        } else {
          StaffFoundEmbed.setTitle(`${discord_steam}`)
        }

      }

    } catch (error) {
      return (
        interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
        console.error(chalk.redBright('Erro no Banimento'), error)
      );
    }
    if (rows == '') {
      return interaction.reply({ content: `**${interaction.user} | Não encontrei nenhum cargo para __${discord_steam}__**` }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }


    await interaction.deferReply()
    await interaction.followUp({ content: `**${interaction.user} | Estou te enviando os sets no seu privado!**` })

    rows = rows.sort((a, b) => (
      Object.keys(serverGroups).findIndex(key => serverGroups[key].value == `${a.flags}`)
      >
      Object.keys(serverGroups).findIndex(key => serverGroups[key].value == `${b.flags}`)
    ) ? 1 : -1)

    rows = await rows.map((item) => {

      let cargo = Object.keys(serverGroups).find(key => serverGroups[key].value == `${item.flags}`)
      let server = serversInfos.find(server => server.serverNumber == item.server_id)
      server == undefined ? server = 'TODOS' : server = server.visualName


      return (
        [
          {
            name: `<a:diamante:650792674248359936> **${server}** <a:diamante:650792674248359936>`,
            value: '\u200B'
          },
          { name: `\u200B`, value: `**set**`, inline: true },
          { name: `\u200B`, value: `\u200B`, inline: true },
          {
            name: `\u200B`,
            value: `\`\`\`${`${item.playerid}  ${cargo}${item.discordID ? ` ${item.discordID}` : ''}`}\`\`\``,
            inline: true,
          }
        ]
      )
    });


    for (let i in rows) {
      StaffFoundEmbed.addFields(
        rows[i]
      )
      if (StaffFoundEmbed.data.fields.length == 24 || i == rows.length - 1) {
        await interaction.user.send({ embeds: [StaffFoundEmbed] });
        StaffFoundEmbed.data.fields = []
      }

    }
    interaction.editReply({ content: `Todos os sets foram enviados no seu pv!` }).then(m => setTimeout(() => {
      m.delete()
    }, 5000))
  },
};
