const { serversInfos } = require('../../configs/config_geral');
const { BanirSolicitar } = require('./handle/banirSolicitar');
const { BanirTemp } = require('./handle/banir');
const { Desbanir } = require('./handle/desbanir');

module.exports = {
    name: 'ban',
    description: 'Opções de Ban',
    options: [
        {
            name: 'solicitar', type: 1, description: 'Solicitar um banimento', options: [
                { name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null },
                { name: 'servidor', type: 3, description: 'Qual servidor ele estava?', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                { name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null },
                { name: 'discord', type: 6, description: 'discord do player (opcional)', required: false, choices: null },
                { name: 'arquivo1', type: 11, description: 'Prova em imagem (opcional 1)', required: false, choices: null },
                { name: 'arquivo2', type: 11, description: 'Prova em imagem (opcional 2)', required: false, choices: null },
                { name: 'arquivo3', type: 11, description: 'Prova em imagem (opcional 3)', required: false, choices: null },
                { name: 'link', type: 3, description: 'Link (opcional)', required: false, choices: null },
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
        {
            name: 'remover', type: 1, description: 'Para realizar um banimento', options: [
                { name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null },
                { name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null }
            ]
        },
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '722814929056563260', type: 1, permission: true }], // Gerente

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
                        interaction.options.getAttachment('arquivo1'),
                        interaction.options.getAttachment('arquivo2'),
                        interaction.options.getAttachment('arquivo3'),
                    ],
                    interaction.options.getString('link')

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
            case 'remover':
                Desbanir(client, interaction,
                    interaction.options.getString('steamid'),
                    interaction.options.getString('motivo'),
                )
                break;
            default:
                break;
        }
    }
}