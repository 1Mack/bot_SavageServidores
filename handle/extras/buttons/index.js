const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const { TicketCreate } = require('../../ticket/Create_Ticket')
const { FormCreate } = require('../../formulario/index')
const { TicketClosed, TicketOpened, TicketDeleting, TicketLog, ticketActionsEmbed } = require('../../ticket/embed');
const { Save } = require('../../ticket/Save_Ticket');
const { Diretor_DemotarConfirm } = require('../../../commands/demotar/handle');
const { Captcha } = require('../../protection');
const { Diretor_UpConfirm } = require('../../../commands/set/handle/procurar_merecedores_handle');
const { Form_resultado } = require('../form_resultado');
const { Staff } = require('../../../commands/set/handle/normal');
const { Delete_AskQuestion } = require('../../ticket/handles/delete_askQuestion');
const { EmbedBuilder } = require('discord.js');
const { guildsInfo } = require('../../../configs/config_geral');
const { Solicitado_banirCancelar } = require('./handle/banir_cancelarSolicitado');
const { Telando_handle_ban } = require('../../../commands/telagem/handle/telando_handle_ban');
const { Telando_handle_cancel } = require('../../../commands/telagem/handle/telando_handle_cancel');
const { Desbanir_handle } = require('../../../commands/ban/handle/desbanirHandle/desbanir_handle');
const { Desmutar_handle } = require('../../../commands/comms/handle/desmutarHandle/desmutar_handle');

const functionCargos = {
  'ticket'(interaction, client) {
    TicketCreate(interaction, client)
  },
  async 'lock'(interaction, client) {
    //lock
    if (!interaction.member.roles.cache.has('711022747081506826') && !interaction.member.roles.cache.has('722814929056563260'))
      return interaction.reply({ content: 'Você não tem permissão para fechar o ticket', ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))

    const rows = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('unlock')
          .setLabel('Abrir')
          .setEmoji('<:unlock_savage:856225547210326046>')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('delete')
          .setLabel('Deletar')
          .setEmoji('<:delete_savage:856222528997556244>')
          .setStyle(ButtonStyle.Danger),
      );
    interaction.update({ components: [] })
    interaction.channel.send({ embeds: [TicketClosed(interaction.user)], components: [rows] })

    interaction.guild.members.cache.get(interaction.channel.topic).send({
      embeds: [ticketActionsEmbed('fechado', interaction.user.username, interaction.channel)]
    }).catch(() => { })


    interaction.channel.permissionOverwrites.edit(interaction.channel.topic, {
      ViewChannel: false,
    });
    client.channels.cache.get('757709253766283294').send({ embeds: [TicketLog(interaction.user, 'Fechado', interaction.channel)] });
  },
  async 'unlock'(interaction, client) {
    //unlock
    let userFind = interaction.guild.members.cache.find((m) => m.id == interaction.user.id);

    if (userFind._roles.filter((m) => m == '722814929056563260' || m == '603318536798077030') == '')
      return interaction.reply({ content: 'Você não tem permissão para abrir o ticket', ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))

    interaction.guild.members.cache.get(interaction.channel.topic).send({
      embeds: [ticketActionsEmbed('aberto', interaction.user.username, interaction.channel)]
    }).catch(() => { })

    await interaction.channel.permissionOverwrites.edit(interaction.channel.topic, {
      ViewChannel: true,
    });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('lock')
          .setLabel('Fechar')
          .setEmoji('<:lock_savage:856224681136226314>')
          .setStyle(ButtonStyle.Primary)
      )

    interaction.update({ components: [] })
    interaction.channel.send({ embeds: [TicketOpened(interaction.user)], components: [row] })

    client.channels.cache.get('757709253766283294').send({ embeds: [TicketLog(interaction.user, 'Aberto', interaction.channel)] });
  },
  async 'delete'(interaction, client) {
    //delete
    if (interaction.user.id !== '323281577956081665')
      return interaction.reply({ content: 'Você não tem permissão para excluir o ticket', ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))

    interaction.update({ components: [] })

    const channel = interaction.guild.channels.cache.get(interaction.channelId)


    Delete_AskQuestion(interaction, channel).then(async message => {
      interaction.channel.send({ embeds: [TicketDeleting(interaction.user)] });

      if (message != null) {
        let userDM = await client.users.cache.get(channel.topic).createDM()

        userDM_messages = await userDM.messages.fetch({ limit: 15 })

        userDM_messages = userDM_messages.find(f => f.embeds.find(embed => embed.title.includes(`${channel.name.slice(channel.name.lastIndexOf('→') + 1)}`)))


        userDM_messages.embeds[0].fields.push({ name: 'Considerações Finais', value: `\`\`\`\n${message}\`\`\``, inline: false })

        userDM_messages.edit({ embeds: [userDM_messages.embeds[0]] })

        const embed = new EmbedBuilder().setColor('36393f').setDescription(`Seu ticket foi encerrado! [Confira o resumo dele clicando aqui](https://discord.com/channels/@me/${userDM.id}/${userDM_messages.id})`)

        userDM_messages.reply({ embeds: [embed] })
      }


      client.channels.cache
        .get('757709253766283294')
        .send({ embeds: [TicketLog(interaction.user, 'Deletado', interaction.channel)] });

      Save(interaction, client)

      setTimeout(() => {
        interaction.channel.delete();
      }, 5000);
    })


  },
  'formulario'(interaction, client) {
    FormCreate(interaction, client)
  },
  'horasdemotar_demotar2'(interaction, client) {
    Diretor_DemotarConfirm(interaction, client)
  },
  'horasdemotar_recusado'(interaction, client) {
    Diretor_DemotarConfirm(interaction, client)
  },
  'captchaStart'(interaction, client) {
    Captcha(interaction, client)
  },
  'up_confirm2'(interaction, client) {
    Diretor_UpConfirm(interaction, client)
  },
  'up_recusado'(interaction, client) {
    Diretor_UpConfirm(interaction, client)
  },
  'verform_resultado_averiguar'(interaction, client) {
    Form_resultado(interaction, client)
  },
  async 'verform_resultado_aprovado'(interaction, client) {

    Staff(
      client,
      interaction,
      interaction.guild.members.cache.get(interaction.message.embeds[0].fields.find(f => f.name.includes('Discord')).value.replace(/[<@>]/g, '')),
      interaction.message.embeds[0].fields.find(f => f.name.includes('SteamID')).value,
      'trial',
      interaction.message.embeds[0].fields.find(f => f.name.includes('Servidor')).value,
      'formulário'
    ).then(m => {
      if (m) {
        interaction.message.embeds[0].title = `APROVADO`

        interaction.message.edit({ components: [], embeds: [interaction.message.embeds[0]] })
      }
    })

  },
  async 'verform_resultado_reprovado'(interaction, client) {

    interaction.message.embeds[0].footer.text = `Reprovado pelo ${interaction.user.username} na parte do SET`
    interaction.message.embeds[0].title = `REPROVADO NA HORA DO SET`

    interaction.message.edit({ components: [], embeds: [interaction.message.embeds[0]] })

    const member = interaction.guild.members.cache.get(interaction.message.embeds[0].fields.find(f => f.name.includes('Discord')).value.replace(/[<@>]/g, ''))

    member.send(`**Você foi reprovado pelo ${interaction.user.username} na hora da setagem!**\n[Qualquer dúvida abra um ticket](https://discord.com/channels/${guildsInfo.main}/855200110685585419/927000168933511219)`).catch(() => { })

    member.roles.set(member._roles.filter(m => m != member.roles.cache.get(interaction.member.guild.roles.cache.get())))

    let guildRole = await interaction.guild.roles.cache.find(r => r.name == `Entrevista | ${interaction.message.embeds[0].fields.find(f => f.name.includes('Servidor')).value.toUpperCase()}`)

    member.roles.remove(guildRole).catch(() => { })

  },
  'banirSolicitado'(interaction, client) {
    Solicitado_banirCancelar(interaction, client, 'banirSolicitado')
  },
  'cancelarSolicitado'(interaction, client) {
    Solicitado_banirCancelar(interaction, client, 'cancelarSolicitado')
  },
  'banidoSolicitado'(interaction, client) {
    Solicitado_banirCancelar(interaction, client, 'banidoSolicitado')
  },
  'telando_banir'(interaction, client) {
    if (!interaction.member._roles.includes('800826968417108028'))
      return interaction.reply({ content: 'Somente quem tem a tag de telador pode clicar nesse botão', ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))


    Telando_handle_ban(interaction)
  },
  'telando_cancelar'(interaction, client) {
    if (!interaction.member._roles.includes('800826968417108028'))
      return interaction.reply({ content: 'Somente quem tem a tag de telador pode clicar nesse botão', ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))

    Telando_handle_cancel(interaction)
  },
  'desban_cancel'(interaction, client) {
    Desbanir_handle(client, interaction, 'cancel')
  },
  'desban_approve'(interaction, client) {
    Desbanir_handle(client, interaction, 'approve')
  },
  'desmute_cancel'(interaction, client) {
    Desmutar_handle(client, interaction, 'cancel')
  },
  'desmute_approve'(interaction, client) {
    Desmutar_handle(client, interaction, 'approve')
  },
  /* 'acharInativosStaff'(interaction, client) {

    const fs = require('fs');
    let data = JSON.parse(fs.readFileSync('./cache.json', { encoding: 'utf8' }))

    if (!data.find(m => m == interaction.user.id)) {
      interaction.guild.channels.cache.get('951236136678871040').send(`${interaction.user} clicou no botao de nv`)
      return interaction.reply(`${interaction.user} |Voce não esta na database ou ja clicou no botão!`)
    }

    let findData = data.filter(m => m != interaction.user.id)

    fs.writeFileSync('./cache.json', JSON.stringify(findData))

    interaction.reply({ content: `${interaction.user} | Voce clicou com sucesso e nao sera demotado!`, ephemeral: true })
    interaction.guild.channels.cache.get('951236136678871040').send(`${interaction.user} se registrou`)
  } */
};


module.exports = {
  functionCargos,
};
