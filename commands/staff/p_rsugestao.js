const Discord = require('discord.js');
const { WrongUsageOfCommand, newEmbed, UserSendEmbed } = require('./embed');
module.exports = {
    name: 'rsugestao',
    description: 'Responder as Sugestões',
    options: [
        {name: 'msgid', type: 3, description: 'Id da msg da sugestão', required: true, choices: null},
        {name: 'validation', type: 3, description: 'Escolher um Servidor para o Set', required: true, choices: [{name: 'aprovado', value: 'true'}, {name: 'reprovado', value: 'false'}]},
        {name: 'reason', type: 3, description: 'Motivo da resposta', required: true, choices: null},
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '832268791459086376', type: 1, permission: true}],//Perm Sugestão
    async execute(client, interaction) {
        let msgId = interaction.options.getString('msgid'),
            validation = interaction.options.getString('validation').toLowerCase(),
            reason = interaction.options.getString('reason').toLowerCase()

        if (validation == 'true') {
            validation = {
                color: '0CD531',
                title: 'Aprovado',
            };
        } else {
            validation = { color: 'CF1616', title: 'Reprovado' };
        }

        try {
            const canal = client.guilds.cache
                .get('343532544559546368')
                .channels.cache.find((channel) => channel.id === '778411417291980830');
            canal.messages.fetch(msgId).then(async (m) => {
                if(['Aprovado', 'Reprovado'].includes(m.embeds[0].title)) return interaction.reply({content: '**Essa msg já foi respondida!!**'}).then(() => setTimeout(() => interaction.deleteReply(), 10000))
                m.edit({embeds: [newEmbed(validation, m, reason, interaction)]});

                try {
                    let fetchUser = await client.users.fetch(m.embeds[0].title.substr(-22, 18));

                    fetchUser.send({embeds: [UserSendEmbed(validation, msgId)]});
                } catch (err) {}
            });
        } catch (error) {
            console.log(error);
            client.channels.cache
                .get('770401787537522738')
                .send({content: '<@323281577956081665> | **Houve um erro ao editar a msg!**'});
        } finally {
        }
    },
};
