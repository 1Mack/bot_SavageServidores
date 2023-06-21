const { BanirSolicitar } = require("../../ban/handle/banirSolicitar");
const { Verification } = require("./verifications");
const { TelandoButtons } = require('./buttons');
const { EmbedBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const wait = require('util').promisify(setTimeout);

exports.Telando_handle_ban = async function (interaction, isFromCancelled) {

  const telandoButtons = TelandoButtons()

  interaction.message.delete()
  interaction.reply({ content: 'Deseja prosseguir com essa ação?', components: [telandoButtons.confirm] })

  let filter = i => {
    i.deferUpdate();
    return i.user.id == interaction.user.id && i.channelId == interaction.channelId;
  };

  let { customId } = await interaction.channel
    .awaitMessageComponent({ filter, time: 100000, errors: ['time'] }).catch((err) => {
      console.log(err)
      interaction.message.delete()
      interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })
      return interaction.channel.send('Você não respondeu a tempo...voltando ao painel inicial!').then(() => setTimeout((m) => {
        m.delete()
      }, 5000))
    })
  interaction.deleteReply()

  if (customId === 'nao') {
    return interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })
  }


  let findChannel = interaction.guild.channels.cache.get(interaction.channelId)
  let [, targetDiscord, teladorDiscord] = findChannel.name.split('→')

  const embed = new EmbedBuilder().setAuthor({ name: `Nova Telagem Realizada` }).setColor('36393f').setFields(
    { name: 'Telador', value: `<@${teladorDiscord}>` },
    { name: 'Nick', value: '\u200B' },
    { name: 'SteamID', value: '\u200B' },
    { name: 'Servidor', value: '\u200B' },
    { name: 'Discord', value: `<@${targetDiscord}>` },
    { name: 'AnyDesk', value: '\u200B' },
    { name: 'Observações', value: '\u200B' },
    { name: 'Arquivos', value: '\u200B' },
  )
  let msg = await findChannel.send({ embeds: [embed], components: [telandoButtons.banFields, telandoButtons.evidences] })

  let loopBool = true, interactionLoop, allowSendToBan = false

  const filter2 = msg => {

    return msg.author.id === interaction.user.id
  };
  filter = i => {
    return i.user.id == interaction.user.id && i.channelId == interaction.channelId;
  };

  let banInfos = {
    link: '',
    attachments: [],
    nick: '',
    steamid: '',
    anydesk: '',
    servidor: '',
    observacoes: '',
  }

  while (loopBool) {

    interactionLoop = await msg.channel.awaitMessageComponent({ filter, time: 100000, componentType: ComponentType.Button, errors: ['time'] }).catch(() => { })

    if (!interactionLoop) {

      interaction.message.delete()
      interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })
      interaction.channel.send('Você não respondeu a tempo...voltando ao painel inicial!')
      return interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })

    }

    msg.components.map(m => m.components.map(x => x.data.disabled = true))

    switch (interactionLoop.customId) {
      case 'nick':
        await getButton('**Informe o Nick do player**', 'nick', 'nick')
        break;
      case 'steamid':
        await getButton('**Informe o Link do Perfil do player**', 'steamid', 'steamid')
        break;
      case 'anydesk':
        await getButton('**Informe o ANYDESK do player**', 'anydesk', 'anydesk')
        break;
      case 'servidor':
        await getButton('**Informe o SERVIDOR**', 'servidor', 'servidor')
        break;
      case 'observacoes':
        await getButton('**Informe as OBSERVAÇÕES**', 'observacoes', 'observações')
        break;
      case 'file':
        await getButton('**Envie o arquivo**', 'file')
        break;
      case 'link':
        await getButton('**Informe o link**', 'link', 'link')
        break;
      case 'send':
        await getButton('**Enviando para o telados!**', 'send')
        break;
    }
  }

  async function getButton(replyMessage, componentID, fieldID) {

    msg.edit({ components: msg.components })



    if (componentID === 'servidor') {

      await interactionLoop.reply({ components: [telandoButtons.ServersMenu] })

      let menuSelectinteraction = await interactionLoop.
        channel.awaitMessageComponent({ filter, time: 100000, componentType: ComponentType.StringSelect, errors: ['time'] }).catch(() => { })
      interactionLoop.deleteReply()

      if (!menuSelectinteraction) {
        reloadButtons()

        return msg.edit({ components: msg.components })
      } else {

        banInfos.servidor = menuSelectinteraction.values[0]

        msg.embeds[0].data.fields.find(f => f.name.toLowerCase() === fieldID).value = menuSelectinteraction.values[0]
      }


    } else if (componentID === 'send') {

      await interactionLoop.reply(replyMessage)

      if (isFromCancelled) {
        loopBool = false
        msg.delete()

        interaction.guild.channels.cache.get('903453341944791041').send({ embeds: msg.embeds })
        interactionLoop.editReply('***Enviado para o telados com sucesso***')
        await wait(5000)
        return findChannel.delete()

      } else {

        let ban = await BanirSolicitar(
          null,
          interaction,
          banInfos.nick,
          banInfos.steamid,
          banInfos.servidor,
          'Algo foi encontrado na telagem!',
          targetDiscord,
          banInfos.anydesk.length > 0 ? banInfos.anydesk : '\u200B',
          banInfos.attachments,
          banInfos.link.length > 0 ? banInfos.link : undefined
        )

        if (ban == 'sucesso') {
          loopBool = false

          msg.delete()
          interactionLoop.editReply('***Sugestão de banimento concluída com sucesso...excluindo sala***')
          interaction.guild.channels.cache.get('903453341944791041').send({ embeds: msg.embeds })
          await wait(5000)
          return findChannel.delete()

        } else {
          loopBool = false

          await interactionLoop.editReply(`***${ban}***`)
          await wait(5000)
          return findChannel.send({ content: '<:blank:773345106525683753>', components: [TelandoButtons().banFields] })

        }

      }

    } else {

      await interactionLoop.reply(replyMessage)

      let interactionMessage = await interactionLoop.channel
        .awaitMessages({ filter: filter2, time: 100000, max: 1, errors: ['time'] }).catch(() => { })
      interactionLoop.deleteReply()

      if (!interactionMessage) {
        reloadButtons()
        return msg.edit({ components: msg.components })
      } else {


        interactionMessage = interactionMessage.first()
        if (componentID === 'link') {

          msg.embeds[0].data.description = `***Links disponíveis***\n\n${interactionMessage.content}`
          banInfos.link = interactionMessage.content

        } else if (componentID === 'file') {

          if (interactionMessage.attachments.size > 3) return interactionMessage.channel.send('**Você só pode enviar até 3 arquivos!**').then(async m => {
            interactionMessage.delete()
            reloadButtons()
            await wait(5000)
            m.delete()
            return msg.edit({ components: msg.components })
          })

          let msgFileLog = await interaction.guild.channels.cache.get('1056947300229984256').send({ files: await interactionMessage.attachments.map(att => new AttachmentBuilder(att.attachment)) })

          banInfos.attachments = msgFileLog.attachments.map(m => m)

          msg.embeds[0].data.fields.find(f => f.name.toLowerCase() === 'arquivos').value = `${banInfos.attachments.map(m => m.attachment).join(', ')}`


        } else if (componentID === 'steamid') {
          interactionMessage.delete()
          let steamidFormat = await Verification(interactionMessage.content)

          if (steamidFormat.startsWith('Erro')) {
            interactionMessage.channel.send(steamidFormat).then(async m => {
              await wait(5000)
              m.delete()
            })
            reloadButtons()
            return msg.edit({ components: msg.components })

          } else {
            msg.embeds[0].data.fields.find(f => f.name.toLowerCase() === fieldID).value = `[${steamidFormat}](${interactionMessage.content})`
            banInfos[componentID] = steamidFormat
          }

        } else {
          msg.embeds[0].data.fields.find(f => f.name.toLowerCase() === fieldID).value = interactionMessage.content
          banInfos[componentID] = interactionMessage.content
        }
      }


      interactionMessage.delete()

    }
    if (isFromCancelled) {
      if (banInfos.servidor.length > 0 &&
        banInfos.steamid.length > 0 &&
        banInfos.nick.length > 0) {
        allowSendToBan = true
      }
    } else {
      if (
        !(banInfos.link.length === 0 && banInfos.attachments.length === 0) &&
        banInfos.servidor.length > 0 &&
        banInfos.steamid.length > 0 &&
        banInfos.nick.length > 0
      ) {
        allowSendToBan = true
      }
    }

    reloadButtons()

    return msg.edit({ components: msg.components, embeds: msg.embeds })

  }
  function reloadButtons() {
    msg.components.map(m => m.components.map(x => {
      if (x.data.custom_id === 'send') {
        if (allowSendToBan) {
          x.data.disabled = false
        } else {
          x.data.disabled = true
        }
      } else {
        x.data.disabled = false
      }
    }))
    return msg
  }
}