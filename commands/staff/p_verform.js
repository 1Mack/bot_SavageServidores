const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ComponentType, ButtonStyle } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos, guildsInfo } = require('../../configs/config_geral');
const { GerenteError, PlayerDiscordNotFound } = require('../../embed/geral');
const {
  FormAlreadyOpened,
  FormCompleted,
  FormCreated,
  LogReprovado,
  LogAprovado,
  LogAprovadoChannel,
  logInfos,
} = require('./embed');

module.exports = {
  name: 'verform',
  description: 'Ver os formulários',
  options: [
    { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um servidor', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) }
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let servidor = interaction.options.getString('servidor')

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole) && !interaction.member._roles.find(m => m == '892029388135206922'))
      return interaction.reply({ embeds: [GerenteError(interaction.user)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

    const con = connection.promise();

    let canalCheck = interaction.guild.channels.cache.find((m) => m.name.includes(`verform${servidor}`));

    if (canalCheck === undefined) {
      await interaction.guild.channels.create({
        name: `verform${servidor}→${interaction.user.id}`,
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
      canalCheck = client.channels.cache.find((m) => m.name === `verform${servidor}→${interaction.user.id}`);
    } else {
      return interaction.reply({ embeds: [FormAlreadyOpened(interaction.user)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }

    let logGuild = client.guilds.cache.get(guildsInfo.log);

    let canal = logGuild.channels.cache.find(
      (channel) => channel.name == servidor && channel.parentId == '839343718016614411'
    );
    canal = await canal.messages.fetch();

    canal = await canal.map((m) => m);
    if (canal == undefined) {
      return interaction.reply({ embeds: [FormCompleted(interaction.user)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }
    await interaction.deferReply()

    interaction.followUp({ embeds: [FormCreated(interaction.user, canalCheck)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));

    let msg = await canalCheck.send(`${interaction.user}`)

    for (let x in canal) {

      let discord_id = canal[x].embeds[0].description.match(/\d+/)[0];

      let [result] = await con.query(
        `select form_messages_2Etapa.message_id, message_question, servidor, discord_id, awnser from form_messages_2Etapa
                inner join form_respostas_2Etapa
                on form_messages_2Etapa.message_id = form_respostas_2Etapa.message_id
                where form_respostas_2Etapa.discord_id = ${discord_id} AND (form_respostas_2Etapa.server_choosen = "${servidor}" OR form_respostas_2Etapa.server_choosen = "geral")`
      );

      if (result == '') {
        let logNotResult = await logGuild.channels.cache.find((channel) => channel.id == '843580489800745011');
        logNotResult.send({ content: `**${discord_id}** estava sem respostas no form de **${servidor}**!` });
        canal[x].delete();
        continue;
      }

      let formMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${canal[x].embeds[0].title} → ${discord_id}`);
      let formMessage2 = new EmbedBuilder().setColor('#0099ff')
      let formMessage3 = new EmbedBuilder().setColor('#0099ff')

      let cont = 1;


      for (let i in result) {
        if (cont < 6) {
          formMessage = formMessage.addFields(
            {
              name: `Pergunta ${result[i].servidor} número ${cont}`,
              value: result[i].message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        } else if (cont < 12) {
          formMessage2 = formMessage2.addFields(
            {
              name: `Pergunta ${result[i].servidor} número ${cont}`,
              value: result[i].message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        } else {
          formMessage3 = formMessage3.addFields(
            {
              name: `Pergunta ${result[i].servidor} número ${cont}`,
              value: result[i].message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        }
      }


      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Aprovar')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('reprove')
            .setLabel('Reprovar')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Próximo')
            .setStyle(ButtonStyle.Primary),
        )
      if (formMessage2.fields != '') {
        if (formMessage3.fields != '') {
          await msg.edit({ content: ' ', embeds: [formMessage, formMessage2, formMessage3], components: [row] })

        } else {
          await msg.edit({ content: ' ', embeds: [formMessage, formMessage2], components: [row] })
        }
      } else {
        await msg.edit({ content: ' ', embeds: [formMessage], components: [row] });
      }

      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      };

      await canalCheck
        .awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 1000000 })
        .then(async (collected) => {

          if (collected.customId == 'next') {
            return;
          } else if (collected.customId == 'reprove') {
            let fetchUser
            try {
              fetchUser = await client.users.fetch(discord_id);
            } catch (error) {
              msg.edit({ embeds: [PlayerDiscordNotFound(interaction)], components: [] })
                .then(async (m) => {
                  await wait(5000)
                  await m.delete()
                });
            }
            canal[x].delete();
            let [resultServerCheck] = await con.query(`SELECT discord_id, server_choosen FROM form_respostas_2Etapa where discord_id = "${discord_id}"`)

            await con.query(
              `delete from form_respostas_2Etapa where discord_id = ${discord_id} 
                            ${resultServerCheck.filter(m => m.server_choosen != 'geral' && m.server_choosen != servidor) != '' ? `AND server_choosen = "${servidor}"` : ''}`
            );

            fetchUser.send({ embeds: [LogReprovado(fetchUser, servidor)] });
            logGuild.channels.cache.get('880985449198407683').send({ embeds: [logInfos(fetchUser, result)] })
          } else {

            let fetchUser, fetchedUser

            try {
              fetchUser = await client.users.fetch(discord_id);
              fetchedUser = await interaction.guild.members.fetch(fetchUser);
            } catch (error) {
              await msg.edit({ embeds: [PlayerDiscordNotFound(interaction)], components: [] })
                .then(async (m) => {
                  await wait(5000)

                  fetchedUser = false

                  logGuild.channels.cache.get('880985449198407683').send({ embeds: [logInfos(fetchUser, result)] })

                  fetchUser.send({ embeds: [LogReprovado(fetchUser)] });
                });
            }
            if (fetchedUser) {

              fetchedUser.roles.add(await interaction.guild.roles.cache.find(m => m.name == `Entrevista | ${(servidor).toUpperCase()}`));

              fetchUser.send({ embeds: [LogAprovado(fetchUser, servidor)] });

              client.channels.cache.get('848364797975068682').send({ embeds: [LogAprovadoChannel(interaction.user, fetchUser, result).embed], components: [LogAprovadoChannel(interaction.user, fetchUser, result).row] });

              let canalLogInfo = await logGuild.channels.cache.find(
                (channel) => channel.name == servidor && channel.parentId == '842203130208321557'
              );
              await canalLogInfo.send({ embeds: [logInfos(fetchUser, result)] })
            }

            canal[x].delete();

            let [resultServerCheck] = await con.query(`SELECT discord_id, server_choosen FROM form_respostas_2Etapa where discord_id = "${discord_id}"`)

            await con.query(
              `delete from form_respostas_2Etapa where discord_id = ${discord_id} 
                            ${resultServerCheck.filter(m => m.server_choosen != 'geral' && m.server_choosen != servidor) != '' ? `AND server_choosen = "${servidor}"` : ''}`
            );
          }
        })
        .catch(async () => {
          try {
            return (
              await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, components: [], embeds: [] }),
              await wait(6000),
              await canalCheck.delete()
            )
          } catch (error) { }
        });
    }

    try {
      await msg.edit({ content: ' ', embeds: [FormCompleted(interaction.user)], components: [] });
      await wait(6000)
      await canalCheck.delete();

    } catch (error) {

    }

  },
};
