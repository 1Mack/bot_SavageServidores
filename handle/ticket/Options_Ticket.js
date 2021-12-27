const { TicketTypeChoosed } = require('./embed');
const {MessageActionRow, MessageButton} = require('discord.js')
const {compra_Handle} = require('./handles/compra_handle')
const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('lock')
                        .setLabel('Fechar')
                        .setEmoji('<:lock_savage:856224681136226314>')
                        .setStyle('PRIMARY'),        
            );
const Options = {
    'bugs'(m, user, roles, msg) {
        //bugs
        m.permissionOverwrites.set([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.setName('ticket→bugs')
        m.send({content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>`}).then((m) =>
            m.delete()
        );
        msg.edit({embeds: [TicketTypeChoosed(user, 'Bugs', roles.servidor)], components: [row]})
    },
    'denuncia'(m, user, roles, msg) {
        //Denuncia
        m.permissionOverwrites.set([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.setName('ticket→denuncia')
        m.send({content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>`}).then((m) =>
            m.delete()
        );
        msg.edit({embeds: [TicketTypeChoosed(user, 'Denúncia', roles.servidor)], components: [row]})
    },
    'banimento'(m, user, roles, msg) {
        //Banimento
        m.permissionOverwrites.set([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.setName('ticket→banimento')
        m.send({content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>`}).then((m) =>
            m.delete()
        );
        msg.edit({embeds: [TicketTypeChoosed(user, 'Banimento', roles.servidor)], components: [row]})
    },
    async 'compra_cargo'(m, user, roles, msg) {
        //Compra de Cargo
        m.permissionOverwrites.set([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.setName('ticket→compras')
        m.send({content: `<@&${roles.roleGerente}>, <@&780582159731130378>`}).then((m) => m.delete());
        
        msg.edit({embeds: [TicketTypeChoosed(user, 'Compras', roles.servidor, (await compra_Handle(m, user, msg)))], components: [row]})
    },
    'duvida'(m, user, roles, msg) {
        //Dúvidas
        m.permissionOverwrites.set([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.setName('ticket→duvidas')
        m.send({content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>`}).then((m) =>
            m.delete()
        );
        msg.edit({embeds: [TicketTypeChoosed(user, 'Dúvidas', roles.servidor)], components: [row]})
    },
};

module.exports = { Options };
