const { serversInfos, paidRoles, normalServerRoles } = require('../../configs/config_geral');
const { Comprado } = require('../../handle/extras/setar/comprado');
const { Staff } = require('../../handle/extras/setar/normal');
const { UP_Procurar_merecedores } = require('../../handle/extras/setar/procurar_merecedores');
const { UP_Especifico } = require('../../handle/extras/setar/up_especifico');


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
            name: 'staff', type: 1, description: 'Para cargos normais de staff', options: [
                { name: 'discord', type: 6, description: 'discord do player', required: true, choices: null },
                { name: 'steamid', type: 3, description: 'Steamid do player', required: true, choices: null },
                { name: 'cargo', type: 3, description: 'Escolha um cargo para o Set', required: true, choices: normalServerRoles.map(m => { return { name: m, value: m } }) },
                { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                { name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null }
            ]
        },
        /*  {
             name: 'staff_vip', type: 1, description: 'Para cargos de staff com vip', options: [
                 { name: 'discord', type: 6, description: 'discord do player', required: true, choices: null },
                 { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                 { name: 'observações', type: 3, description: 'Observações sobre o set', required: true, choices: null }
             ]
         }, */
        {
            name: 'up', type: 2, description: 'Upar um staff', options: [
                {
                    name: 'especifico', type: 1, description: 'Upar um staff especifico', options: [
                        { name: 'discord', type: 6, description: 'discord do player', required: true, choices: null },
                        { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
                        { name: 'motivo', type: 3, description: 'Movito do UP', required: true, choices: null }
                    ]
                },
                {
                    name: 'procurar_merecedores', type: 1, description: 'Ver quais staffs merecem ser upado', options: [
                        { name: 'servidor', type: 3, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },

                    ]
                }

            ]
        },
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '711022747081506826', type: 1, permission: true }, { id: '831219575588388915', type: 1, permission: true }], // Gerente

    async execute(client, interaction) {

        const command = interaction.options.getSubcommand()

        switch (command) {
            case 'comprado':
                Comprado(client, interaction,
                    interaction.options.getUser('discord'),
                    interaction.options.getString('steamid'),
                    interaction.options.getString('cargo').toLowerCase(),
                    interaction.options.getInteger('tempo'),
                    interaction.options.getNumber('valor'),
                    interaction.options.getString('servidor').toLowerCase(),
                    interaction.options.getString('observações')
                )
                break;
            case 'staff':
                Staff(client, interaction,
                    interaction.options.getUser('discord'),
                    interaction.options.getString('steamid'),
                    interaction.options.getString('cargo').toLowerCase(),
                    interaction.options.getString('servidor').toLowerCase(),
                    interaction.options.getString('observações')
                )
                break;
            case 'staff_vip':
                StaffVip(client, interaction,
                    interaction.options.getUser('discord'),
                    interaction.options.getString('servidor').toLowerCase(),
                    interaction.options.getString('observações')
                )
                break;
            case 'especifico':
                UP_Especifico(client, interaction,
                    interaction.options.getUser('discord'),
                    interaction.options.getString('servidor').toLowerCase(),
                    interaction.options.getString('motivo')
                )
                break;
            case 'procurar_merecedores':
                UP_Procurar_merecedores(client, interaction,
                    interaction.options.getString('servidor').toLowerCase(),
                )
                break;

            default:
                break;
        }
    }
}