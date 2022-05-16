const { TicketTypeChoosed } = require('./embed');
const { MessageActionRow, MessageButton } = require('discord.js');
const { guildsInfo } = require('../../configs/config_geral');
const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('lock')
            .setLabel('Fechar')
            .setEmoji('<:lock_savage:856224681136226314>')
            .setStyle('PRIMARY'),
    );
const Options = {
    async 'bugs'(m, user, roles, msg, id) {
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
                id: guildsInfo.main, //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        await m.setName(`bugs→${id}`)
        m.send({ content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>` }).then((m) =>
            m.delete()
        );
        msg.edit({ embeds: [TicketTypeChoosed(user, 'Bugs', roles.servidor)], components: [row] })
    },
    async 'denuncia'(m, user, roles, msg, id) {
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
                id: guildsInfo.main, //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        await m.setName(`denuncia→${id}`)
        m.send({ content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>` }).then((m) =>
            m.delete()
        );
        msg.edit({ embeds: [TicketTypeChoosed(user, 'Denúncia', roles.servidor)], components: [row] })
    },
    async 'banimento'(m, user, roles, msg, id) {
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
                id: guildsInfo.main, //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        await m.setName(`banimento→${id}`)
        m.send({ content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>` }).then((m) =>
            m.delete()
        );
        msg.edit({ embeds: [TicketTypeChoosed(user, 'Banimento', roles.servidor)], components: [row] })
    },
    async 'duvida'(m, user, roles, msg, id) {
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
                id: guildsInfo.main, //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        await m.setName(`duvidas→${id}`)
        m.send({ content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>` }).then((m) =>
            m.delete()
        );
        msg.edit({ embeds: [TicketTypeChoosed(user, 'Dúvidas', roles.servidor)], components: [row] })
    },
};

module.exports = { Options };
