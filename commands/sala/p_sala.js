const { Sala_Convidar } = require('./handle/convidar');
const { Sala_Criar } = require('./handle/criarsala');

module.exports = {
    name: 'sala',
    description: 'Comandos de configuração de sala',
    options: [
        {
            name: 'criar', type: 1, description: 'Para criar uma sala privada', options: [
                { name: 'nome', type: 3, description: 'Nome da Sala', required: true, choices: null },

            ]
        },
        {
            name: 'convidar', type: 1, description: 'Para convidar alguém para a sua sala privada', options: [
                { name: 'discord', type: 6, description: 'Discord do player', required: true, choices: null }
            ]
        },
    ],
    default_permission: true,
    cooldown: 0,
    permissions: [],

    async execute(client, interaction) {

        const command = interaction.options.getSubcommand()

        switch (command) {
            case 'criar':
                Sala_Criar(interaction, client,
                    interaction.options.getString('nome'),

                )
                break;
            case 'convidar':
                Sala_Convidar(interaction, client,
                    interaction.options.getUser('discord')
                )
                break;
            default:
                break;
        }
    }
}