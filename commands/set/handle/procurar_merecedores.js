const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ChannelType, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { connection, connection2 } = require('../../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

exports.UP_Procurar_merecedores = async function (client, interaction, servidor) {

  const serversInfosFound = serversInfos.find((m) => m.name === servidor);

  if (!interaction.member.roles.cache.has(serversInfosFound.gerenteRole) && !interaction.member.roles.cache.has('831219575588388915'))
    return interaction.reply({
      content: `😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`, ephemeral: true
    })



  let canalCheck = await client.channels.cache.find((m) => m.name === `upando→${interaction.user.id}`);

  if (canalCheck === undefined) {
    await interaction.guild.channels.create({
      name: `upando→${interaction.user.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
      parent: '936310042225934408',
    });
    canalCheck = await client.channels.cache.find((m) => m.name === `upando→${interaction.user.id}`);
  }
  await interaction.deferReply()
  interaction.followUp({ content: `[Canal criado com sucesso!!!](https://discord.com/channels/${guildsInfo.main}/${canalCheck.id})` }).then(m => {
    setTimeout(() => {
      m.delete()
    }, 5000);
  })

  await canalCheck.bulkDelete(100);

  let msg = await canalCheck.send(`${interaction.user}`)

  let result, result2;
  const con = connection.promise();
  const con2 = connection2.promise();


  if (result == '') {
    return (
      await msg.edit({ content: 'Houve algum erro inesperado!! Deletando canal' }),
      await wait(6000),
      canalCheck.delete()
    );
  }

  try {
    [result] = await con2.query(
      `SELECT * FROM Cargos where flags NOT REGEXP 't' and server_id = '${serversInfosFound.serverNumber}'`
    );


  } catch (error) {
    return (
      console.error(error),
      msg.edit({ content: 'Ouve um erro inesperado', embeds: [], components: [] })
    );
  }

  if (result == '') {
    return (
      interaction.followUp({ content: '**Esse jogador não não tem set**' }).then(m => {
        setTimeout(() => {
          m.delete()
        }, 7000);
      })
    );
  }
  let outloop
  for (let i in result) {
    const logGuildUpConfirm = await client.guilds.cache.get(guildsInfo.log).channels.cache.get('931637295902240838')

    const logGuildUpConfirmMessages = await logGuildUpConfirm.messages.fetch().then(m =>
      m.find(m => m.embeds[0].data.fields.find(a => a.name == 'DiscordID' && a.value == result[i].discord_id) && m.embeds[0].footer.text == servidor)
    )

    if (logGuildUpConfirmMessages) {
      continue;
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

    try {
      [result2] = (await con.query(`select * from mostactive_${servidor} 
            where steamid regexp '${result[i].playerid.slice(8)}'
           `))[0]

    } catch (error) {
      return (
        console.error(error),
        msg.edit({ content: 'Ouve um erro inesperado', embeds: [], components: [] })
      );
    }

    if (result2 == undefined) {
      continue;
    }

    let formMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(result2.playername.toString())
      .addFields(
        { name: 'Steamid', value: result[i].playerid.toString() },
        { name: 'DiscordID', value: `<@${result[i].discordID}>` },
        { name: 'Cargo', value: Object.keys(serverGroups).find(key => serverGroups[key].value === result[i].flags).toString() },
        { name: 'Último Set', value: `${new Date(result[i].timestamp).toLocaleDateString('en-GB')}` },
        { name: `**Horas Totais**`, value: HourFormat(result2.total) },
        { name: `**Horas Spec**`, value: HourFormat(result2.timeSPE) },
        { name: `**Horas TR**`, value: HourFormat(result2.timeTT) },
        { name: `**Horas CT**`, value: HourFormat(result2.timeCT) },
        { name: `**Última conexao**`, value: new Date(result2.last_accountuse * 1000).toLocaleDateString('en-GB') },

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
          .setLabel('Proximo')
          .setStyle(ButtonStyle.Primary),

      );
    await msg.edit({ content: ' ', embeds: [formMessage], components: [row] });

    const filter = i => {
      i.deferUpdate();
      return i.user.id == interaction.user.id && i.channelId == canalCheck.id;
    };

    await canalCheck
      .awaitMessageComponent({ filter, time: 100000, errors: ['time'] })
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

          await msg.edit({ content: 'Diga o por quê você acha que ele deve ser upado! (Você tem 45s)', embeds: [], components: [] }).then(async (m) => {

            const filterMSG = (m) => m.author === interaction.user;

            await m.channel
              .awaitMessages({
                filterMSG,
                max: 1,
                time: 45000,
                errors: ['time'],
              })
              .then(async (message) => {
                message = message.first();
                message.delete();

                formMessage.addFields(
                  { name: `**Motivo do UP**`, value: message.content.toString() },
                  { name: `**Sugerido Pelo**`, value: interaction.user.username.toString() },
                )

                canalCheck.send(`Staff <@${result[i].discordID}> enviado para análise com sucesso!`).then(async m => setTimeout(() => m.delete(), 5000))

                logGuildUpConfirm.send({ embeds: [formMessage], components: [row2] }).then(message => {
                  let embedDiretorMSG = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setDescription(`[Novo staff para ser upado](https://discord.com/channels/${guildsInfo.log}/931637295902240838/${message.id})`);

                  interaction.guild.channels.cache.get('873396752760307742').send({ embeds: [embedDiretorMSG], content: '@everyone' })
                })

              })
              .catch(() => {
                return (msg.edit({
                  content:
                    '**Você não respondeu a tempo!!! lembre-se, você tem apenas 15 segundos para responder!** \n***Irei pular esse staff*** <a:savage_loading:837104765338910730>',
                })
                  .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
              });
          })


        }
      })
      .catch(async (error) => {

        await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: [] })
        if (error.code !== 'INTERACTION_COLLECTOR_ERROR') console.log(error)

        await wait(5000)
        outloop = true
      });

    if (outloop) {
      break;
    }
  }

  if (!outloop) {
    await msg.edit({ content: 'todos os staffs ja foram vistos!\n**Deletando canal em 5 segundos!!**', embeds: [], components: [] });
  }

  await wait(5000)
  await canalCheck.delete();


};
