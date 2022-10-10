const { connection, connection2 } = require('../../configs/config_privateInfos');
const { serversInfos, serverGroups } = require('../../configs/config_geral');
const { ApplicationCommandOptionType, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const {
  AskQuestion,
  CheckDatabaseError,
  Top1NotFound,
  logVip,
  vipSendMSG,
  SetSuccess,
} = require('./embed');
const chalk = require('chalk');

const { InternalServerError } = require('../../embed/geral');
module.exports = {
  name: 'resetrank',
  description: 'Resetar Rank dos servidores',
  options: [],
  default_permission: false,
  async execute(client, interaction) {
    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('SIM')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('nao')
          .setLabel('NAO')
          .setStyle(ButtonStyle.Primary),
      )
    await interaction.reply({ embeds: [AskQuestion(interaction)], components: [buttons], ephemeral: true })

    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 15000 })
      .then(async ({ customId }) => {

        if (customId == 'nao') {
          return interaction.channel.send(`Abortando comando<a:savage_loading:837104765338910730>`)
            .then((m) => setTimeout(() => {
              m.delete()
            }, 8000))
        } else {

          const servidores = ['awp', 'mix', 'retake', 'retakepistol', 'arena'];

          let rows, rows1;
          for (let serverNumber in servidores) {

            const con = connection.promise();
            const con2 = connection2.promise();


            try {
              [rows] = await con.query(
                `select lvl_${servidores[serverNumber]}.steam, 
                lvl_${servidores[serverNumber]}.name, 
                lvl_${servidores[serverNumber]}.value, du_users.userid from lvl_${servidores[serverNumber]} 
                inner join du_users on lvl_${servidores[serverNumber]}.steam = du_users.steamid order by value desc limit 5`
              );
            } catch (error) {
              return (
                interaction.channel.send({ embeds: [InternalServerError(interaction)] })
                  .then((m) => setTimeout(() => {
                    m.delete()
                  }, 8000)),
                console.error(chalk.redBright('Erro no Select'), error)
              );
            }

            async function DeletarRank() {
              try {
                await con.query(`delete from lvl_${servidores[serverNumber]}`);
              } catch (error) {
                return (
                  console.error(chalk.redBright('Erro no Delete'), error),
                  interaction.channel.send({ embeds: [CheckDatabaseError(interaction, servidores, serverNumber)] })
                    .then((m) => setTimeout(() => {
                      m.delete()
                    }, 8000))
                );
              }
            }

            let procurar = rows.find((m) => m.userid !== '');
            if (procurar !== undefined) {
              const serversInfosFound = serversInfos.find((m) => m.name === servidores[serverNumber]);

              try {
                [rows1] = await con2.query(
                  `select * from Cargos where playerid regexp "${procurar.steam.slice(8)}" AND server_id = '${serversInfosFound.serverNumber}'`
                );
              } catch (error) {
                return (
                  interaction.channel.send({ embeds: [InternalServerError(interaction)] })
                    .then((m) => setTimeout(() => {
                      m.delete()
                    }, 8000)),
                  console.error(chalk.redBright('Erro no Select'), error)
                );
              }
              let fetchedUser
              try {

                fetchedUser = await interaction.guild.members.cache.get(procurar.userid);
                if (!fetchedUser) throw new Error('User Not Found on Discord')

              } catch (error) {
                interaction.channel.send({ embeds: [Top1NotFound(interaction, servidores, serverNumber, procurar)] }).then((m) => setTimeout(() => {
                  m.delete()
                }, 8000))
                await DeletarRank();

                continue;
              }

              let dataInicial = Date.now();
              dataInicial = Math.floor(dataInicial / 1000);

              let dataFinal = dataInicial + 30 * 86400,
                DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');

              let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


              if (rows1 == '' || (rows1.length > 1 && rows1.find(m => Object.keys(serverGroups).find(key => serverGroups[key].value === m.flags) != 'vip'))) {
                try {
                  await con2.query(`
                                        INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id) 
                                        VALUES (NULL, NULL, '${procurar.steam}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)), 'a/t', '${serversInfosFound.serverNumber}')
                                    `
                  );
                } catch (error) {
                  interaction.channel.send({ embeds: [InternalServerError(interaction)] }).then((m) => setTimeout(() => {
                    m.delete()
                  }, 8000))
                  console.error(chalk.redBright('Erro no Insert'), error)
                  await DeletarRank()
                  continue;
                }
              } else {
                try {
                  await con2.query(
                    `UPDATE Cargos SET 
                                    flags = 'a/t', 
                                    enddate = (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY))
                                    WHERE (playerid regexp '${procurar.steam.slice(8)}') AND server_id = "${serversInfosFound.serverNumber}"`
                  );
                } catch (error) {

                  interaction.channel.send({ embeds: [InternalServerError(interaction)] }).then((m) => setTimeout(() => {
                    m.delete()
                  }, 8000))
                  console.error(chalk.redBright('Erro no Update'), error)
                  await DeletarRank()
                  continue;
                }
              }


              interaction.channel.send({ embeds: [SetSuccess(interaction, fetchedUser, servidores, serverNumber)] })
                .then((m) => setTimeout(() => {
                  m.delete()
                }, 8000))

              let guild = client.guilds.cache.get('792575394271592458');

              const canal = guild.channels.cache.find(
                (channel) => channel.id === '851458777470337084'
              );
              canal.send({
                embeds: [
                  logVip(
                    interaction.user,
                    fetchedUser,
                    procurar,
                    DataInicialUTC,
                    DataFinalUTC,
                    servidores,
                    serverNumber
                  )
                ]
              });
              fetchedUser.send({ embeds: [vipSendMSG(fetchedUser.user, servidores, serverNumber)] }).catch(() => { })
              await DeletarRank();
            } else {
              interaction.channel.send(`Não teve nenhum **TOP** no servidor **${servidores[serverNumber]}**`)
                .then((m) => setTimeout(() => {
                  m.delete()
                }, 8000))
              await DeletarRank();
              continue;
            }
          }
        }
      })
      .catch((err) => {
        console.log(err)
        interaction.channel.send(`Você não respondeu a tempo, abortando comando<a:savage_loading:837104765338910730>`)
          .then((m) => setTimeout(() => {
            m.delete()
          }, 8000))
      });

  },
};
