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

    let channelMessages = await logGuild.channels.cache.find(
      (channel) => channel.name == servidor && channel.parentId == '839343718016614411'
    ).messages.fetch()

    channelMessages = await channelMessages.map((m) => m);

    if (channelMessages == undefined) {
      return interaction.reply({ embeds: [FormCompleted(interaction.user)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }

    interaction.reply({ embeds: [FormCreated(interaction.user, canalCheck)], ephemeral: true })

    let msg = await canalCheck.send(`${interaction.user}`)

    for (let channelMessage of channelMessages) {

      let discord_id = channelMessage.embeds[0].description.match(/\d+/)[0];

      let [messagesJoinAwsers] = await con.query(
        `select form_messages_secondStep.id, message_question, servidor, discord_id, awnser from form_messages_secondStep
                inner join form_awnsers_secondStep
                on form_messages_secondStep.id = form_awnsers_secondStep.message_id
                where form_awnsers_secondStep.discord_id = "${discord_id}" AND (form_awnsers_secondStep.server_choosen = "${servidor}" OR form_awnsers_secondStep.server_choosen = "geral")`
      );

      if (messagesJoinAwsers == '' ||
        messagesJoinAwsers.filter(msgs => msgs.servidor == servidor) == '' ||
        messagesJoinAwsers.filter(msgs => msgs.servidor == 'geral').length < 9) {
        let logNotResult = await logGuild.channels.cache.find((channel) => channel.id == '843580489800745011');
        logNotResult.send({ content: `**${discord_id}** estava sem respostas no form de **${servidor}**!` });
        if (!messagesJoinAwsers) {

          try {
            let [resultServerCheck] = await con.query(`SELECT discord_id, server_choosen FROM form_awnsers_secondStep where discord_id = "${discord_id}"`)

            await con.query(
              `delete from form_awnsers_secondStep where discord_id = ${discord_id} 
                                ${resultServerCheck.filter(m => m.server_choosen != 'geral' && m.server_choosen != servidor) != ''
                &&
                messagesJoinAwsers.filter(msgs => msgs.servidor == 'geral').length == 9
                ? `AND server_choosen = "${servidor}"`
                : ''}`
            );
          } catch (error) {
            console.log(error)
            msg.edit('vouve um erro ao deletar os registros dele na database!')
            await wait(5000)
          }
        }

        channelMessage.delete();

        continue;
      }

      let formMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${channelMessage.embeds[0].title} → ${discord_id}`);
      let formMessage2 = new EmbedBuilder().setColor('#0099ff')
      let formMessage3 = new EmbedBuilder().setColor('#0099ff')

      let cont = 1;


      for (let messageJoinAwser of messagesJoinAwsers) {
        if (cont < 6) {
          formMessage = formMessage.addFields(
            {
              name: `Pergunta ${messageJoinAwser.servidor} número ${cont}`,
              value: messageJoinAwser.message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${messageJoinAwser.awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        } else if (cont < 12) {
          formMessage2 = formMessage2.addFields(
            {
              name: `Pergunta ${messageJoinAwser.servidor} número ${cont}`,
              value: messageJoinAwser.message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${messageJoinAwser.awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        } else {
          formMessage3 = formMessage3.addFields(
            {
              name: `Pergunta ${messageJoinAwser.servidor} número ${cont}`,
              value: messageJoinAwser.message_question.toString(),
              inline: true,
            },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '\u200B', value: `***${messageJoinAwser.awnser}***`, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
          );
          cont += 1;
        }
      }


      const buttons = new ActionRowBuilder()
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
          await msg.edit({ content: ' ', embeds: [formMessage, formMessage2, formMessage3], components: [buttons] })

        } else {
          await msg.edit({ content: ' ', embeds: [formMessage, formMessage2], components: [buttons] })
        }
      } else {
        await msg.edit({ content: ' ', embeds: [formMessage], components: [buttons] });
      }

      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      };

      const buttonInteraction = await canalCheck.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 1000000 })
        .catch(async (err) => {
          console.log(err)
          await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, components: [], embeds: [] })
          await wait(6000)
          return await canalCheck.delete()

        });

      if (buttonInteraction.customId == 'next') {
        continue;
      } else if (buttonInteraction.customId == 'reprove') {

        let fetchUser
        try {

          fetchUser = await interaction.guild.members.cache.get(discord_id);


        } catch (error) {
          msg.edit({ embeds: [PlayerDiscordNotFound(interaction)], components: [] })
        }

        channelMessage.delete();

        if (fetchUser) fetchUser.send({ embeds: [LogReprovado(fetchUser.user, servidor)] }).catch(() => { })


        logGuild.channels.cache.get('880985449198407683').send({ embeds: [logInfos(fetchUser ? fetchUser.user : discord_id, messagesJoinAwsers)] })

        let [resultServerCheck] = await con.query(`SELECT discord_id, server_choosen FROM form_awnsers_secondStep where discord_id = "${discord_id}"`)

        try {
          await con.query(
            `delete from form_awnsers_secondStep where discord_id = ${discord_id} 
                              ${resultServerCheck.filter(m => m.server_choosen != 'geral' && m.server_choosen != servidor) != '' ? `AND server_choosen = "${servidor}"` : ''}`
          );
        } catch (error) {
          console.log(error)
          msg.edit('vouve um erro ao deletar os registros dele na database!')

          await wait(5000)

        }




      } else {

        let fetchUser

        try {

          fetchUser = await interaction.guild.members.cache.get(discord_id);

        } catch (error) {
          await msg.edit({ embeds: [PlayerDiscordNotFound(interaction)], components: [] })
            .then(async () => {
              await wait(5000)

              logGuild.channels.cache.get('880985449198407683').send({ embeds: [logInfos(fetchUser ? fetchUser.user : discord_id, messagesJoinAwsers)] })

            });
        }
        if (fetchUser) {

          fetchUser.roles.add(await interaction.guild.roles.cache.find(m => m.name == `Entrevista | ${(servidor).toUpperCase()}`));

          fetchUser.send({ embeds: [LogAprovado(fetchUser.user, servidor)] }).catch(() => { })

          let logAprovadoChannelFunction = LogAprovadoChannel(interaction.user, fetchUser.user, messagesJoinAwsers)

          client.channels.cache.get('848364797975068682').send({ embeds: [logAprovadoChannelFunction.embed], components: [logAprovadoChannelFunction.row] });

          let canalLogInfo = await logGuild.channels.cache.find(
            (channel) => channel.name == servidor && channel.parentId == '842203130208321557'
          );
          await canalLogInfo.send({ embeds: [logInfos(fetchUser.user, messagesJoinAwsers)] })
        }

        channelMessage.delete();

        let [resultServerCheck] = await con.query(`SELECT discord_id, server_choosen FROM form_awnsers_secondStep where discord_id = "${discord_id}"`)

        await con.query(
          `delete from form_awnsers_secondStep where discord_id = ${discord_id} 
                            ${resultServerCheck.filter(m => m.server_choosen != 'geral' && m.server_choosen != servidor) != '' ? `AND server_choosen = "${servidor}"` : ''}`
        );
      }

    }

    try {
      await msg.edit({ content: ' ', embeds: [FormCompleted(interaction.user)], components: [] });
      await wait(6000)
      await canalCheck.delete();

    } catch (error) {

    }

  },
};
