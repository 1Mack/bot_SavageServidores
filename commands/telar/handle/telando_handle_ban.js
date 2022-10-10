const { ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { serversInfos } = require("../../../configs/config_geral");
const { BanirSolicitar } = require("../../ban/handle/banirSolicitar");
const { ModalForm } = require("./modalForm");
const { Verification } = require("./verifications");
const wait = require('util').promisify(setTimeout);

exports.Telando_handle_ban = async function (interaction) {

  let findChannel = interaction.guild.channels.cache.get(interaction.channelId),
    [, targetDiscord, teladorDiscord] = findChannel.name.split('→')


  ModalForm(interaction).then(async ({ nick, steamid, servidor, anydesk, observacoes, i }) => {

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apenas link')
        .setLabel('APENAS LINK')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('apenas arquivos')
        .setLabel('APENAS ARQUIVOS')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('arquivos e link')
        .setLabel('ARQUIVOS E LINK')
        .setStyle(ButtonStyle.Primary)

    )

    await i.reply(
      {
        content: `
          Leia os dados à seguir com atenção, se algum deles estiver errado, basta guardar 30 segundos para poder responder novamente!!

          nick: ${nick}
          steamid: ${steamid}
          servidor: ${servidor['name']}
          ${anydesk ? `anydesk: ${anydesk}` : ''}
          ${observacoes ? `observacoes: ${observacoes}` : ''}


          ***${interaction.user} Clique no botão abaixo correspondente a quais provas você quer salvar!***`,
        components: [button]
      }
    )
    const filter2 = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    await interaction.channel.awaitMessageComponent({ filter2, componentType: ComponentType.Button, time: 60000 })
      .then(async ({ customId }) => {

        await i.editReply({
          components: [], content: `Você selecionou ${customId}!! \nLembre-se, ${customId.includes('apenas') ?
            customId.includes('link') ?
              'envie apenas **UMA mensagem** contendo **um link**' :
              'envie até no máximo **3 imagens** em apenas **UMA mensagem**' :
            'envie apenas **UMA mensagem** contendo **um link** E até no máximo **3 imagens**'
            }`
        })


        const filter = response => {
          return interaction.user.id === response.author.id
        };
        let loopCount = 0, evidences = {}
        while (loopCount < 3) {

          await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async message => {

              message = message.first()
              message.delete()

              if (customId === 'apenas link') {
                if (message.content.startsWith('http') && !message.content.slice(5).includes('http')) {
                  evidences.link = message.content
                  return loopCount = 4
                }
              } else if (customId === 'apenas arquivos') {
                if (message.attachments.size > 0) {
                  evidences.attachments = message.attachments.map(m => m)
                  return loopCount = 4
                }
              } else {
                if (message.content.startsWith('http') && !message.content.slice(5).includes('http') && message.attachments.size > 0 && message.attachments.size <= 3) {
                  evidences.link = message.content
                  evidences.attachments = message.attachments.map(m => m)
                  return loopCount = 4
                }
              }

              await i.editReply({
                content: `***LEIA COM ATENÇÃO, VOCÊ ERROU O ENVIO DA MENSAGEM ANTERIOR***\n\nVocê selecionou ${customId}!! \nLembre-se, ${customId.includes('apenas') ?
                  customId.includes('link') ?
                    'envie apenas **UMA mensagem** contendo **um link**' :
                    'envie até no máximo **3 imagens** em apenas **UMA mensagem**' :
                  'envie apenas **UMA mensagem** contendo **um link** E até no máximo **3 imagens**'
                  }`
              })
              loopCount++
            })
        }

        if (loopCount != 4) {
          await i.editReply('Você errou as 3 tentativas, voltando para mensagem inicial')
          await wait(5000)

          const buttonFinal = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('telando_cancelar')
              .setLabel('ENCERRAR SALA')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('telando_banir')
              .setLabel('BANIR')
              .setStyle(ButtonStyle.Danger)

          )
          await findChannel.bulkDelete(100)

          return findChannel.send({ content: '<:blank:773345106525683753>', components: [buttonFinal] })
        }

        const embed = new EmbedBuilder().setAuthor({ name: `Nova Telagem Realizada` }).setColor('911010').setFields(
          { name: 'Telador', value: `<@${teladorDiscord}>` },
          { name: 'Nick', value: nick },
          { name: 'SteamID', value: steamid },
          { name: 'Servidor', value: servidor.name },
          { name: 'Discord', value: `<@${targetDiscord}>` },
          { name: 'AnyDesk', value: anydesk ? anydesk : '\u200B' },
          { name: 'Observações', value: observacoes ? observacoes : '\u200B' },
        )
        interaction.guild.channels.cache.get('903453341944791041').send({ embeds: [embed] })

        let ban = await BanirSolicitar(
          null,
          interaction,
          nick,
          steamid,
          servidor.name,
          'Algo foi encontrado na telagem!',
          targetDiscord,
          anydesk ? anydesk : '\u200B',
          evidences['attachments'] ? evidences.attachments : [],
          evidences['link'] ? evidences.link : undefined
        )

        if (ban == 'sucesso') {
          i.editReply('***Sugestão de banimento concluída com sucesso...excluindo sala***')
          await wait(5000)
          return findChannel.delete()
        } else {
          await i.editReply(`***${ban}***`)
          await wait(5000)
          throw new Error('Error')
        }

      }).catch(async err => {

        const buttonFinal = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('telando_cancelar')
            .setLabel('ENCERRAR SALA')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('telando_banir')
            .setLabel('BANIR')
            .setStyle(ButtonStyle.Danger)

        )
        await findChannel.bulkDelete(100)

        return findChannel.send({ content: '<:blank:773345106525683753>', components: [buttonFinal] })
      });
  })

}