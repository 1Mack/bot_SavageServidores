const { serversInfos, paidRoles, normalServerRoles } = require('../../configs/config_geral');
const { Normal } = require('./normal');
const { Comprado } = require('./comprado');

module.exports = {
    name: 'setar',
    description: 'Setar um cargo para algum player',
    options: [
        {
            name: 'comprado', type: 1, description: 'Para cargos comprados', options: [
                { name: 'discord', type: 6, description: 'discord do player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do player', required: true, choices: null },
                { name: 'cargo', type: 3, description: 'Escolha um cargo para o Set', required: true, choices: paidRoles.map(m => { return { name: m, value: m } }) },
                { name: 'tempo', type: 4, description: 'Tempo em dias do set', required: true, choices: null },
                { name: 'valor', type: 10, description: 'Valor pago pelo player', required: true, choices: null },
                { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                { name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null }
            ]
        },
        {
            name: 'normal', type: 1, description: 'Para cargos normais', options: [
                { name: 'discord', type: 6, description: 'discord do player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do player', required: true, choices: null },
                { name: 'cargo', type: 3, description: 'Escolha um cargo para o Set', required: true, choices: normalServerRoles.map(m => { return { name: m, value: m } }) },
                { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                { name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null }
            ]
        },
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '711022747081506826', type: 1, permission: true }, { id: '831219575588388915', type: 1, permission: true }], // Gerente

    async execute(client, interaction) {

        const command = interaction.options.getSubcommand()

        if (command === 'comprado') {
            Comprado(client, interaction,
                interaction.options.getUser('discord'),
                interaction.options.getString('steamid'),
                interaction.options.getString('cargo').toLowerCase(),
                interaction.options.getInteger('tempo'),
                interaction.options.getNumber('valor'),
                interaction.options.getString('servidor').toLowerCase(),
                interaction.options.getString('observações')
            )
        } else if (command === 'normal') {
            Normal(client, interaction,
                interaction.options.getUser('discord'),
                interaction.options.getString('steamid'),
                interaction.options.getString('cargo').toLowerCase(),
                interaction.options.getString('servidor').toLowerCase(),
                interaction.options.getString('observações')
            )
        }
    }
}