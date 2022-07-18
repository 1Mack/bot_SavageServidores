const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { connection, connection2 } = require('../../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');

const { NotTarget } = require('./embed');
const { InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');


exports.UP_Especifico = async function (client, interaction, servidor, motivo, discord_steam) {
  if (!discord_steam) return interaction.reply({ content: 'Você precisa informar o discord ou a steamid do player!!', ephemeral: true })
  if (typeof (discord_steam) == 'string') {
    discord_steam = { steam: discord_steam }
  } else {
    discord_steam = { discord: discord_steam }

  }
  await interaction.deferReply()

  let result, result2;
  const con = connection.promise();
  const con2 = connection2.promise();

  const serversInfosFound = serversInfos.find((m) => m.name === servidor);

  try {
    [result] = (await con2.query(`SELECT * FROM Cargos where 
        ${discord_steam['discord'] ? `playerid regexp 
        REPLACE(
            (select playerid from Cargos where discordID = '${discord_steam['discord'].id}' LIMIT 1), 
            SUBSTRING(
                (select playerid from Cargos where discordID = '${discord_steam['discord'].id}' LIMIT 1), 
                1, 8), 
                ''
            )` :
        `playerid regexp ${discord_steam['steam'].slice(8)}`}
        AND (server_id = '${serversInfosFound.serverNumber}' OR server_id = '0')`))
  } catch (error) {
    return (
      interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(m => {
        setTimeout(() => {
          m.delete()
        }, 7000);
      }),
      console.error(chalk.redBright('Erro no Select'), error)
    );
  }

  if (result.find(m => m.server_id == 0) && result.length == 1) return (
    interaction.followUp({ content: '**Esse player tem cargo em todos os servidores, você terá que ver o cargo manualmente!**' }).then(m => {
      setTimeout(() => {
        m.delete()
      }, 7000);
    })
  );

  result = result[0]

  try {
    [result2] = (await con.query(`select * from mostactive_${servidor} 
         where steamid regexp '${result.playerid.slice(8)}'
        `))[0]

  } catch (error) {
    return (
      interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(m => {
        setTimeout(() => {
          m.delete()
        }, 7000);
      }),
      console.error(chalk.redBright('Erro no Select'), error)
    );
  }

  if (result2 == undefined) {
    return (
      interaction.followUp({ content: '**Esse jogador não tem horas no servidor**' }).then(m => {
        setTimeout(() => {
          m.delete()
        }, 7000);
      })
    );
  }

  if ((['z/a/t', 'a/b/c/d/f/g/h/i/j/k/l/m/n/s/o/t', 'a/b/c/d/f/g/h/i/j/k/l/m/n/s/o/t', 'a/b/c/d/f/g/h/i/j/k/m/s/o/t'].includes(result.flags)))
    return interaction.followUp({ embeds: [NotTarget(interaction)] }).then(m => {
      setTimeout(() => {
        m.delete()
      }, 7000);
    })

  const logGuildUpConfirm = await client.guilds.cache.get(guildsInfo.log).channels.cache.get('931637295902240838')

  const logGuildUpConfirmMessages = await logGuildUpConfirm.messages.fetch().then(m =>
    m.find(m => m.embeds[0].fields.find(a => a.name == 'DiscordID' && a.value == result.discord_id) && m.embeds[0].footer.text == servidor)
  )

  if (logGuildUpConfirmMessages) {
    return (
      interaction.followUp({ embeds: [], content: 'Esse staff já esta em análise para ser upado!!!' }).then(m => {
        setTimeout(() => {
          m.delete()
        }, 7000);
      })
    );
  }


  function HourFormat(duration) {
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);

    if (mins == 0) {
      return `${hrs} horas`
    } else if (hrs == 0) {
      return `${mins} minutos`
    } else {
      return `${hrs} horas e ${mins} minutos`
    }
  }

  let cargo = Object.keys(serverGroups).find(key => serverGroups[key].value === result.flags)
  let msg, exitMessage


  if (result.flags.includes('t') && !['fundador', 'diretor', 'gerente', 'supervisor'].includes(cargo)) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('sim')
          .setLabel('SIM')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('nao')
          .setLabel('NÃO')
          .setStyle(ButtonStyle.Primary),

      );

    msg = await interaction.followUp({ content: '**Esse staff possui cargo de __comprado__, se voce upar ele, ele deixará de ser comprado!!! Tem certeza disso?**', components: [row] });

    const filter = i => {
      i.deferUpdate();
      return i.user.id == interaction.user.id && i.message.id == msg.id;
    };

    await interaction.channel
      .awaitMessageComponent({ filter, time: 20000, errors: ['time'] })
      .then(async ({ customId }) => {


        if (customId == 'nao') {

          return exitMessage = await msg.edit({ content: '***Comando cancelado!!***', components: [] }).then(m => setTimeout(() => {
            m.delete()
          }, 5000))

        } else {
          cargo == 'vip' ? cargo : cargo = cargo.replace(/.$/, '')
        }
      })
      .catch(async (error) => {

        await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Comando abortado**`, embeds: [], components: [] })
        if (error.code !== 'INTERACTION_COLLECTOR_ERROR') {
          console.log(error)
        }
      });
  }
  if (exitMessage) return exitMessage

  let staffInfosMessage = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(result2.playername.toString())
    .addFields(
      { name: 'Steamid', value: result.playerid.toString() },
      { name: 'DiscordID', value: discord_steam['discord'] ? `${discord_steam['discord']}` : 'Sem ' },
      { name: 'Cargo', value: Object.keys(serverGroups).find(key => serverGroups[key].value === result.flags) },
      { name: 'Último Set', value: `${new Date(result.timestamp).toLocaleDateString('en-GB')}` },
      { name: `**Horas Totais**`, value: HourFormat(result2.total) },
      { name: `**Horas Spec**`, value: HourFormat(result2.timeSPE) },
      { name: `**Horas TR**`, value: HourFormat(result2.timeTT) },
      { name: `**Horas CT**`, value: HourFormat(result2.timeCT) },
      { name: `**Última conexao**`, value: new Date(result2.last_accountuse * 1000).toLocaleDateString('en-GB') },
      { name: `**Motivo do UP**`, value: motivo.toString() },
      { name: `**Sugerido Pelo**`, value: interaction.user.username.toString() },

    )
    .setFooter({ text: servidor.toString() })

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('up_confirm')
        .setLabel('Upar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('up_proximo')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Primary),

    );
  await msg.edit({ content: ' ', embeds: [staffInfosMessage], components: [row] });

  const filter = i => {
    i.deferUpdate();
    return i.user.id == interaction.user.id && i.message.id == msg.id;
  };

  await interaction.channel
    .awaitMessageComponent({ filter, time: 20000, errors: ['time'] })
    .then(async ({ customId }) => {


      if (customId == 'up_proximo') {

        return;

      } else if (customId == 'up_confirm') {

        const row2 = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('up_confirm2')
              .setLabel('Upar')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('up_recusado')
              .setLabel('Rejeitar')
              .setStyle(ButtonStyle.Primary),

          );

        msg.edit({ content: `${discord_steam['discord'] ? `${discord_steam['discord']}` : `${discord_steam['steam']}`} enviado para análise com sucesso!`, embeds: [], components: [] })
          .then(async m => setTimeout(() => m.delete(), 5000))

        logGuildUpConfirm.send({ embeds: [staffInfosMessage], components: [row2] }).then(message => {
          let embedDiretorMSG = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`[Novo staff para ser upado](https://discord.com/channels/${guildsInfo.log}/931637295902240838/${message.id})`);

          interaction.guild.channels.cache.get('873396752760307742').send({ embeds: [embedDiretorMSG], content: '@everyone' })
        })


      }
    })
    .catch(async (error) => {

      await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Comando abortado**`, embeds: [], components: [] }).then(m => setTimeout(() => {
        m.delete()
      }, 5000))

      if (error.code !== 'INTERACTION_COLLECTOR_ERROR') {
        console.log(error)
      }
    });

}