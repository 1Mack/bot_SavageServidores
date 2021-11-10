const { WrongNumber, MissingPermission, OldMessage } = require('./embed');
module.exports = {
    name: 'limpar',
    description: 'Limpar chat excluindo mensagens',
    options:[
        {name: 'quantidade', type: 4, description: 'Quantidade de msgs a serem excluídas (>1<99)', required: true, choices: null},
        {name: 'botmsg', type: 5, description: 'Limpar mensagem de bot também?', required: false, choices: null},
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}],//Gerente
    async execute(client, interaction) {
        let quantidade = interaction.options.getInteger('quantidade'),
            botMsg = interaction.options.getBoolean('botmsg')

        if (quantidade > 99 || quantidade < 1)

            return interaction.reply({embeds: [WrongNumber(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        if (botMsg) {
            if (interaction.member.roles.cache.has('603318536798077030')) {
                botMsg = true;
            } else {
                botMsg = false;
                await interaction.reply({embeds: [MissingPermission(interaction)]});
            }
        } else {
            botMsg = false;
        }
        let date = Date.now();
        quantidade += 1;
        interaction.channel.messages.fetch({ limit: quantidade }).then((m) => {
            let messagesFound = [],
                messagesMoreThan14 = [];

            m.forEach(function (element) {
                if (Math.round(Math.abs(date - element.createdTimestamp)) / (1000 * 60 * 60 * 24) < 14) {
                    if (botMsg == false) {
                        if (!element.author.bot) {
                            messagesFound.push(element);
                        }
                    } else {
                        messagesFound.push(element);
                    }
                } else {
                    messagesMoreThan14.push(element);
                }
            });
            if (messagesFound == '') {
                return interaction.reply({content: '**Não achei nenhuma mensagem que eu possa excluir!!**'})
                    .then(() => setTimeout(() => interaction.deleteReply(), 10000));
            }

            try {
                interaction.channel.bulkDelete(messagesFound).then((messages) => {
                    interaction.reply({content:
                            `Deletei ${
                                messages.size > 2
                                    ? `**${messages.size - 1}** mensagens`
                                    : `**${messages.size - 1}** mensagem`
                            }${
                                messagesMoreThan14.length > 0
                                    ? ` e **Não consegui deletar ${messagesMoreThan14.length}** mensagens, pois tem mais de 14 dias que elas foram mandadas`
                                    : ''
                            }`
                        })
                        .then(() => setTimeout(() => interaction.deleteReply(), 10000));
                });
            } catch (err) {
                return interaction.reply({embeds: [OldMessage(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000))
                ||
                interaction.editReply({embeds: [OldMessage(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000))
            }
        });
    },
};
