const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { connection, connection2 } = require('../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: 'horasdemotar',
  description: 'Ver as horas in-game dos staffs',
  options: [{ name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) }],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {

    let servidor = interaction.options.getString('servidor').toLowerCase()

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);
    const con = connection.promise();
    const con2 = connection2.promise();
    if (!interaction.member.roles.cache.has(serversInfosFound.gerenteRole) && !interaction.member.roles.cache.has('831219575588388915'))
      return interaction.reply({
        content: `😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
      })
        .then(() => setTimeout(() => interaction.deleteReply(), 10000));



    let canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);

    if (canalCheck === undefined) {
      await interaction.guild.channels.create({
        name: `horasdemotar→${interaction.user.id}`,
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
      canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);
    }
    await interaction.deferReply()
    interaction.followUp({ content: `Canal criado com sucesso <#${canalCheck.id}>` }).then(m => {
      setTimeout(() => {
        m.delete()
      }, 5000);
    })

    await canalCheck.bulkDelete(100);

    let msg = await canalCheck.send(`${interaction.user}`)
    let result, result2
    try {
      [result2] = await con2.query(
        `select * from Cargos
                where (flags not REGEXP 't' or flags = 'a/b/c/d/f/g/h/i/j/k/m/s/o/t')
                and server_id = '${serversInfosFound.serverNumber}'`
      );
    } catch (error) {

    }

    [result] = await con.query(
      `select * from mostactive_${servidor}
            where (total < '72000' OR total IS NULL) and (${result2.map((m) => `steamid regexp '${m.playerid.slice(8)}'`).join(' or ')})`
    );
    if (result2 == '') {
      return (
        await msg.edit({ content: 'Não achei ninguém com hora menor!! Deletando canal' }),
        await wait(6000),
        canalCheck.delete()
      );
    }


    let outloop
    for (let i in result) {
      const logGuildDemotarConfirm = await client.guilds.cache.get(guildsInfo.log).channels.cache.get('914623602186395778')

      const logGuildDemotarConfirmMessages = await logGuildDemotarConfirm.messages.fetch().then(m =>
        m.find(m => m.embeds[0].fields.find(a => a.name == 'DiscordID' && a.value == result[i].discord_id) && m.embeds[0].footer.text == servidor)
      )

      if (logGuildDemotarConfirmMessages) {
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
      let findCargosStaff = result2.find(m => m.playerid.slice(8) == result[i].steamid.slice(8))

      let formMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(result[i].playername)
        .addFields(
          { name: 'Steamid', value: findCargosStaff.playerid.toString() },
          { name: 'DiscordID', value: `<@${findCargosStaff.discordID}>` },
          { name: 'Cargo', value: Object.keys(serverGroups).find(key => serverGroups[key].value === findCargosStaff.flags).toString() },
          { name: 'Último Set', value: `${new Date(findCargosStaff.timestamp).toLocaleDateString('en-GB')}` },
          { name: `**Horas Totais**`, value: HourFormat(result[i].total) },
          { name: `**Horas Spec**`, value: HourFormat(result[i].timeSPE) },
          { name: `**Horas TR**`, value: HourFormat(result[i].timeTT) },
          { name: `**Horas CT**`, value: HourFormat(result[i].timeCT) },
          { name: `**Última conexao**`, value: new Date(result[i].last_accountuse * 1000).toLocaleDateString('en-GB') },
        )
        .setFooter({ text: servidor.toString() })
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('horasdemotar_confirm')
            .setLabel('Demotar')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('horasdemotar_proximo')
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
        .then(async (collected) => {
          collected = collected.customId

          if (collected == 'horasdemotar_proximo') {

            return;

          } else if (collected == 'horasdemotar_confirm') {

            const row2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('horasdemotar_demotar2')
                  .setLabel('Demotar')
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId('horasdemotar_recusado')
                  .setLabel('Rejeitar')
                  .setStyle(ButtonStyle.Primary),

              );

            await canalCheck.send(`Staff <@${findCargosStaff.discordID}> enviado para análise com sucesso!`).then(async m => setTimeout(() => m.delete(), 5000))

            logGuildDemotarConfirm.send({ embeds: [formMessage], components: [row2] }).then(message => {
              let embedDiretorMSG = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`[Novo staff para ser demotado](https://discord.com/channels/${guildsInfo.log}/914623602186395778/${message.id})`);

              interaction.guild.channels.cache.get('873396752760307742').send({ embeds: [embedDiretorMSG], content: '@everyone' })
            })


          }
        })
        .catch(async (error) => {

          await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: [] })
          if (error.code !== 'INTERACTION_COLLECTOR_ERROR') {
            console.log(error)
          }
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

  },
};
