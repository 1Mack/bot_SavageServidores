const { connection } = require('../../configs/config_privateInfos');
const wait = require('util').promisify(setTimeout);
const { ComponentType, ModalBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, TextInputBuilder } = require('discord.js');
const { FormserverChoose, FormDone, LogForm, ModalFormEmbed } = require('./embed');
const { serversInfos, guildsInfo } = require('../../configs/config_geral');
const { HandleError } = require('../../error');

exports.formSecondStep = async function (user, channel, client, msg) {
  const con = connection.promise();
  let resultCheck, interaction, questions, resultServerFind = []

  try {
    [resultCheck] = await con.query(`select discord_id, server_choosen from form_awnsers_secondStep where discord_id = "${user.id}"`)

  } catch (error) {

    await msg.edit({
      content:
        `${user} **| Houve um erro inesperado, deletando canal!!!\`**`,
      embeds: [], components: []
    })
    await wait(5000)
    await channel.delete()
    return HandleError(client, error)

  }

  if (resultCheck != '') {

    for (let index in serversInfos) {
      if (!resultCheck.find(m => m.server_choosen == serversInfos[index].name)) {
        resultServerFind.push(serversInfos[index].name)
      }
    }
    resultServerFind = serversInfos.filter(m => resultServerFind.includes(m.name) && m.mostActiveServers == true)
  }


  let chooserServer = FormserverChoose(user, resultServerFind)

  msg.edit({ embeds: [chooserServer.embed], components: [chooserServer.lista] })

  const filter = i => {
    i.deferUpdate()
    return i.user.id == user.id && i.channelId == channel.id;
  };

  try {
    interaction = await msg
      .awaitMessageComponent({ filter, time: 300000, componentType: ComponentType.StringSelect, errors: ['time'] })
  } catch (error) {
    HandleError(client, error)

    await msg.edit({
      content:
        `${user} **| Voce não respondeu a tempo, abortando formulário <a:savage_loading:837104765338910730> !!!!\`**`,
      embeds: [],
      components: []
    })
    await wait(5000)
    return channel.delete()

  }

  let interactionValues = interaction.values

  const modalFormEmbed = ModalFormEmbed()

  await msg.edit({ embeds: [modalFormEmbed.embed], components: [modalFormEmbed.row] })

  const filterButtonStart = i => {
    return i.user.id == user.id && i.channelId == channel.id;
  };

  try {
    interaction = await msg.awaitMessageComponent({ filter: filterButtonStart, componentType: ComponentType.Button, time: 50000, errors: ['time'] })
  } catch (error) {
    await msg.edit({
      content:
        `${user} **| Você não clicou no botão, deletando canal!!!\`**`,
      embeds: [], components: []
    })
    await wait(5000)
    await channel.delete()
    return HandleError(client, error)
  }

  modalFormEmbed.row.components[0].setDisabled(true)

  await msg.edit({ components: [modalFormEmbed.row] })

  try {
    [questions] = await con.query(
      `select * from form_messages_secondStep where servidor in (${resultCheck.find(m => m.server_choosen == 'geral') == undefined ? `'geral', '${interactionValues[0]}'` : `'${interactionValues[0]}'`})`
    );
  } catch (error) {

    await msg.edit({
      content:
        `${user} **| Houve um erro inesperado, deletando canal!!!\`**`,
      embeds: [], components: []
    })

    await wait(5000)
    await channel.delete()
    return HandleError(client, error)

  }

  const geralModal = new ModalBuilder().setCustomId(`geral_modal`).setTitle('Formulário para Staff')

  let cont = 2, contTotal = Number(questions.length / 5)
  Number.isInteger(contTotal) ? null : contTotal = Number.parseInt(contTotal) + 1

  const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('prox')
        .setLabel(`Etapa ${cont}/${contTotal}`)
        .setStyle(ButtonStyle.Secondary),
    );

  for (let pos in questions) {

    geralModal.addComponents(new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId(questions[pos].id.toString())
          .setMinLength(2)
          .setRequired(true)
          .setMaxLength(1000)
          .setLabel(`Pergunta número ${Number(pos) + 1} `)
          .setPlaceholder(questions[pos].message_question.toString())
          .setStyle(questions[pos].text_style == 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph),
      ))


    if (pos > 1 && ((Number(pos) + 1) % 5 == 0 || pos == questions.length - 1)) {

      await interaction.showModal(geralModal)

      const filter2 = i => {
        i.deferUpdate().catch(() => { })
        return i.user.id == user.id && i.channelId == channel.id;
      };

      try {
        interaction = await interaction.awaitModalSubmit({ filter: filter2, time: 400000 })
      } catch (error) {
        HandleError(client, error)

        await msg.edit({
          content:
            `${user} **| Voce não respondeu a tempo, abortando formulário <a:savage_loading:837104765338910730> !!!!\`**`,
          embeds: [],
          components: []
        }).catch(() => channel.send(`${user} **| Voce não respondeu a tempo, abortando formulário <a:savage_loading:837104765338910730> !!!!\`**`))
        await wait(5000)
        return channel.delete()
      }

      interaction.fields.fields.map(field => {
        questions.find(q => q.id == field.customId).awnser = field.value
      })

      if (pos == questions.length - 1) {

        try {
          await con.execute(`INSERT INTO form_awnsers_secondStep(discord_id, message_id, awnser, server_choosen) VALUES ${questions.map(() => '(?, ?, ?, ?)')}`,
            questions.flatMap(question => [user.id, question.id, question.awnser, question.servidor]))
        } catch (error) {

          await msg.edit({
            content:
              `${user} **| Houve um erro inesperado, deletando canal!!!\`**`,
            embeds: [], components: []
          })
          await wait(5000)
          await channel.delete()
          return HandleError(client, error)

        }

        const canal = await client.guilds.cache.get(guildsInfo.log).channels.cache.find(
          (channel) => channel.name == interactionValues[0] && channel.parentId == '839343718016614411'
        );

        canal.send({ embeds: [LogForm(user)] });

        msg.edit({ embeds: [FormDone()], components: [], content: '' })

        await wait(15000)
        return channel.delete();
      }

      geralModal.setComponents()

      button.setComponents(
        new ButtonBuilder()
          .setCustomId('prox')
          .setLabel(`Etapa ${cont}/${contTotal}`)
          .setStyle(ButtonStyle.Secondary)
      )

      cont++

      await msg.edit({ components: [button] })

      let filterButton = i => {
        return i.user.id == interaction.user.id && i.channelId == channel.id
      };
      try {
        interaction = await msg.awaitMessageComponent({ filter: filterButton, componentType: ComponentType.Button, time: 50000, errors: ['time'] })
      } catch (error) {
        await msg.edit({
          content:
            `${user} **| Houve um erro inesperado, deletando canal!!!\`**`,
          embeds: [], components: []
        })
        await wait(5000)
        await channel.delete()
        return HandleError(client, error)
      }
      button.components[0].setDisabled(true)

      await msg.edit({ components: [button] })

    }



  }





}

