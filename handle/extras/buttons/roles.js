const { MessageActionRow, MessageButton } = require('discord.js')
const { TicketCreate } = require('../../ticket/Create_Ticket')
const { FormCreate } = require('../../formulario/Create_Form')
const { TicketClosed, TicketOpened, TicketDeleting, TicketLog, ticketActionsEmbed } = require('../../ticket/embed');
const { Save } = require('../../ticket/Save_Ticket');
const { Diretor_DemotarConfirm } = require('../../../commands/demotar/handle');
const { Captcha } = require('../../protection');
const { Diretor_UpConfirm } = require('../../../commands/set/handle/procurar_merecedores_handle');
const { Form_resultado } = require('../form_resultado');
const { Staff } = require('../../../commands/set/handle/normal');
const { Delete_AskQuestion } = require('../../ticket/handles/delete_askQuestion');
const { MessageEmbed } = require('discord.js');
const { guildsInfo } = require('../../../configs/config_geral');
const { Solicitado_banirCancelar } = require('./handle/banir_cancelarSolicitado');

const functionCargos = {
    'ticket'(interaction, client) {
        TicketCreate(interaction, client)
    },
    async 'lock'(interaction, client) {
        //lock
        if (!interaction.member.roles.cache.has('711022747081506826') && !interaction.member.roles.cache.has('722814929056563260')) return interaction.reply({ content: 'Você não tem permissão para fechar o ticket', ephemeral: true });
        const rows = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('unlock')
                    .setLabel('Abrir')
                    .setEmoji('<:unlock_savage:856225547210326046>')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('delete')
                    .setLabel('Deletar')
                    .setEmoji('<:delete_savage:856222528997556244>')
                    .setStyle('DANGER'),
            );
        interaction.update({ components: [] })
        interaction.channel.send({ embeds: [TicketClosed(interaction.user)], components: [rows] })

        interaction.guild.members.cache.get(interaction.channel.topic).send({
            embeds: [ticketActionsEmbed('fechado', interaction.user.username, interaction.channel)]
        })


        interaction.channel.permissionOverwrites.edit(interaction.channel.topic, {
            VIEW_CHANNEL: false,
        });
        client.channels.cache.get('757709253766283294').send({ embeds: [TicketLog(interaction.user, 'Fechado', interaction.channel)] });
    },
    async 'unlock'(interaction, client) {
        //unlock
        let userFind = interaction.guild.members.cache.find((m) => m.id == interaction.user.id);

        if (userFind._roles.filter((m) => m == '722814929056563260' || m == '603318536798077030') == '') return interaction.reply({ content: 'Você não tem permissão para abrir o ticket', ephemeral: true });

        interaction.guild.members.cache.get(interaction.channel.topic).send({
            embeds: [ticketActionsEmbed('aberto', interaction.user.username, interaction.channel)]
        })

        await interaction.channel.permissionOverwrites.edit(interaction.channel.topic, {
            VIEW_CHANNEL: true,
        });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('lock')
                    .setLabel('Fechar')
                    .setEmoji('<:lock_savage:856224681136226314>')
                    .setStyle('PRIMARY')
            )

        interaction.update({ components: [] })
        interaction.channel.send({ embeds: [TicketOpened(interaction.user)], components: [row] })

        client.channels.cache.get('757709253766283294').send({ embeds: [TicketLog(interaction.user, 'Aberto', interaction.channel)] });
    },
    async 'delete'(interaction, client) {
        //delete
        if (interaction.user.id !== '323281577956081665') return interaction.reply({ content: 'Você não tem permissão para excluir o ticket', ephemeral: true }); //Mack

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

                const embed = new MessageEmbed().setColor('36393f').setDescription(`Seu ticket foi encerrado! [Confira o resumo dele clicando aqui](https://discord.com/channels/@me/${userDM.id}/${userDM_messages.id})`)

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

        member.send(`**Você foi reprovado pelo ${interaction.user.username} na hora da setagem!**\n[Qualquer dúvida abra um ticket](https://discord.com/channels/${guildsInfo.main}/855200110685585419/927000168933511219)`)

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

    }
};


module.exports = {
    functionCargos,
};
