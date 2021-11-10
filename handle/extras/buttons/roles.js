const {MessageActionRow, MessageButton} = require('discord.js')
const {TicketCreate} = require('../../ticket/Create_Ticket')
const {FormCreate} = require('../../formulario/Create_Form')
const { TicketClosed, TicketOpened, TicketDeleting, TicketSaved, TicketLog, ticketActionsEmbed } = require('../../ticket/embed');
const { Save } = require('../../ticket/Save_Ticket');

function buttonMessage(buttonType, type, interaction) {
    interaction.reply({content: `Cargo de **${buttonType}** foi **${type}** com sucesso!`, ephemeral: true})
}

const functionCargos = {
    'iBP'(interaction) {
        if (interaction.member.roles.cache.has('808452098030829598')) {
            interaction.member.roles.remove('808452098030829598');
            buttonMessage('Bate Papo', 'removido', interaction)
        } else {
            interaction.member.roles.add('808452098030829598');
            buttonMessage('Bate Papo', 'adicionado', interaction)

        }
    },
    'iRules'(interaction) {
        if (interaction.member.roles.cache.has('808452094637637682')) {
            interaction.member.roles.remove('808452094637637682');
            buttonMessage('Regras', 'removido', interaction)

        } else {
            interaction.member.roles.add('808452094637637682');
            buttonMessage('Regras', 'adicionado', interaction)

        }
    },
    'iTut'(interaction) {
        if (interaction.member.roles.cache.has('808485962161717288'))  {
            interaction.member.roles.remove('808485962161717288');
            buttonMessage('Tutoriais', 'removido', interaction)

        } else {
            interaction.member.roles.add('808485962161717288');
            buttonMessage('Tutoriais', 'adicionado', interaction)

        }
    },
    'iExtras'(interaction) {
        if (interaction.member.roles.cache.has('808452096419823656')) {
            interaction.member.roles.remove('808452096419823656');
            buttonMessage('Extras', 'removido', interaction)

        } else {
            interaction.member.roles.add('808452096419823656');
            buttonMessage('Extras', 'adicionado', interaction)

        }
    },
    'ticket'(interaction, client){
        TicketCreate(interaction, client)
    },
    async 'lock'(interaction, client) {
        //lock
        if(!interaction.member.roles.cache.has('711022747081506826') && !interaction.member.roles.cache.has('722814929056563260')) return interaction.reply({content: 'Você não tem permissão para fechar o ticket', ephemeral: true});
        const rows = new MessageActionRow()
			.addComponents(
		                new MessageButton()
					        .setCustomId('unlock')
					        .setLabel('Abrir')
                            .setEmoji('<:unlock_savage:856225547210326046>')
					        .setStyle('PRIMARY'),
                        new MessageButton()
					        .setCustomId('save')
					        .setLabel('Salvar')
                            .setEmoji('<:save_savage:856212830969659412>')
					        .setStyle('PRIMARY'),
                        new MessageButton()
					        .setCustomId('delete')
					        .setLabel('Deletar')
                            .setEmoji('<:delete_savage:856222528997556244>')
					        .setStyle('DANGER'),
			);
            interaction.update({components: []})
        interaction.channel.send({embeds: [TicketClosed(interaction.user)], components: [rows]})
        
        interaction.guild.members.cache.get(interaction.channel.topic).send({
            embeds: [ticketActionsEmbed('fechado', interaction.user.username, interaction.channel.name.slice(7), interaction.channel)]
        })
        

        interaction.channel.permissionOverwrites.edit(interaction.channel.topic, {
            VIEW_CHANNEL: false,
        });
        client.channels.cache.get('757709253766283294').send({embeds: [TicketLog(interaction.user, 'Fechado', interaction.channel)]});
    },
    async 'unlock'(interaction, client) {
        //unlock
        let userFind = interaction.guild.members.cache.find((m) => m.id == interaction.user.id);

        if (userFind._roles.filter((m) => m == '722814929056563260' || m == '603318536798077030') == '') return interaction.reply({content: 'Você não tem permissão para abrir o ticket', ephemeral: true});
        
        interaction.guild.members.cache.get(interaction.channel.topic).send({
            embeds: [ticketActionsEmbed('aberto', interaction.user.username, interaction.channel.name.slice(7), interaction.channel)]
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

        interaction.update({components: []})
        interaction.channel.send({embeds: [TicketOpened(interaction.user)], components: [row]})

        client.channels.cache.get('757709253766283294').send({embeds: [TicketLog(interaction.user, 'Aberto', interaction.channel)]});
    },
    'save'(interaction, client) {
        //save
        let userFind = interaction.guild.members.cache.find((m) => m.id == interaction.user.id);

        if (userFind._roles.filter((m) => m == '711022747081506826' || m == '603318536798077030') == '') return interaction.reply({content: 'Você não tem permissão para salvar o ticket', ephemeral: true});

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('delete')
			.setLabel('Deletar')
            .setEmoji('<:delete_savage:856222528997556244>')
			.setStyle('DANGER'),
        )
        interaction.update({components: []})
        Save(interaction, client);
        interaction.channel.send({embeds: [TicketSaved(interaction.user)], components: [row]});
        client.channels.cache.get('757709253766283294').send({embeds: [TicketLog(interaction.user, 'Salvo', interaction.channel)]});
    },
    async 'delete'(interaction, client) {
        //delete
        if (interaction.user.id !== '323281577956081665') return interaction.reply({content: 'Você não tem permissão para excluir o ticket', ephemeral: true}); //Mack
        interaction.channel.send({embeds: [TicketDeleting(interaction.user)]});

        interaction.update({components: []})
        setTimeout(() => {
            interaction.channel.delete();
        }, 5000);
        client.channels.cache
            .get('757709253766283294')
            .send({embeds: [TicketLog(interaction.user, 'Deletado', interaction.channel)]});
    },
    'formulario'(interaction, client){
        FormCreate(interaction, client)
    },
};


module.exports = {
    functionCargos,
};
