const { serversInfos } = require('../../configs/config_geral');
const { BanirSolicitar } = require('./handle/banirSolicitar');
const { BanirTemp } = require('./handle/banir')

module.exports = {
    name: 'banir',
    description: 'Setar um cargo para algum player',
    options: [
        {
            name: 'solicitar', type: 1, description: 'Solicitar um banimento', options: [
                { name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null },
                { name: 'servidor', type: 3, description: 'Qual servidor ele estava?', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                { name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null },
                { name: 'discord', type: 6, description: 'discord do player', required: false, choices: null },
                { name: 'file1', type: 11, description: 'Prova', required: false, choices: null },
                { name: 'file2', type: 11, description: 'Prova', required: false, choices: null },
                { name: 'file3', type: 11, description: 'Prova', required: false, choices: null },
                { name: 'file4', type: 11, description: 'Prova', required: false, choices: null },
            ]
        },
        {
            name: 'temp', type: 1, description: 'Para realizar um banimento', options: [
                { name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null },
                { name: 'tempo', type: 4, description: 'Valor em minutos', required: true, choices: null },
                { name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null },
                { name: 'discord', type: 6, description: 'discord do player', required: false, choices: null }
            ]
        },
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '778273624305696818', type: 1, permission: true }], // Gerente

    async execute(client, interaction) {

        const command = interaction.options.getSubcommand()

        switch (command) {
            case 'solicitar':
                BanirSolicitar(client, interaction,
                    interaction.options.getString('nick'),
                    interaction.options.getString('steamid'),
                    interaction.options.getString('servidor').toLowerCase(),
                    interaction.options.getString('motivo'),
                    interaction.options.getUser('discord'),
                    [
                        interaction.options.getAttachment('file1'),
                        interaction.options.getAttachment('file2'),
                        interaction.options.getAttachment('file3'),
                        interaction.options.getAttachment('file4'),
                    ]

                )
                break;
            case 'temp':
                BanirTemp(client, interaction,
                    interaction.options.getString('nick'),
                    interaction.options.getString('steamid'),
                    interaction.options.getInteger('tempo'),
                    interaction.options.getString('motivo'),
                    interaction.options.getUser('discord'),
                )
                break;
            default:
                break;
        }
    }
}