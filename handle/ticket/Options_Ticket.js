const { TicketTypeChoosed } = require('./embed');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { guildsInfo } = require('../../configs/config_geral');
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('lock')
      .setLabel('Fechar')
      .setEmoji('<:lock_savage:856224681136226314>')
      .setStyle(ButtonStyle.Primary),
  );
const Options = {
  async 'bugs'(m, user, roles, msg, id) {
    //bugs
    m.permissionOverwrites.set([
      {
        id: '780582159731130378', //manager
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaff,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleGerente,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel], //user
      },
      {
        id: roles.roleStaffComprado,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: guildsInfo.main, //everyone
        allow: [PermissionFlagsBits.SendMessages],
        deny: [PermissionFlagsBits.ViewChannel],
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
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaff,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleGerente,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaffComprado,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel], //user
      },
      {
        id: guildsInfo.main, //everyone
        allow: [PermissionFlagsBits.SendMessages],
        deny: [PermissionFlagsBits.ViewChannel],
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
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaff,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleGerente,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaffComprado,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel], //user
      },
      {
        id: '800826968417108028',
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: '778273624305696818',
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: guildsInfo.main, //everyone
        allow: [PermissionFlagsBits.SendMessages],
        deny: [PermissionFlagsBits.ViewChannel],
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
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaff,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleGerente,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: roles.roleStaffComprado,
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel], //user
      },
      {
        id: guildsInfo.main, //everyone
        allow: [PermissionFlagsBits.SendMessages],
        deny: [PermissionFlagsBits.ViewChannel],
      },
    ]);
    await m.setName(`duvidas→${id}`)
    m.send({ content: `<@&${roles.roleStaff}>, <@&${roles.roleGerente}>, <@&${roles.roleStaffComprado}>` }).then((m) =>
      m.delete()
    );
    msg.edit({ embeds: [TicketTypeChoosed(user, 'Dúvidas', roles.servidor)], components: [row] })
  },
  async 'compras'(m, user, roles, msg, id) {
    //Dúvidas
    m.permissionOverwrites.set([
      {
        id: '780582159731130378', //manager
        allow: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [PermissionFlagsBits.ViewChannel], //user
      },
      {
        id: guildsInfo.main, //everyone
        allow: [PermissionFlagsBits.SendMessages],
        deny: [PermissionFlagsBits.ViewChannel],
      },
    ]);
    await m.setName(`compras→${id}`)
    m.send({ content: `<@&780582159731130378>,` }).then((m) =>
      m.delete()
    );
    msg.edit({ embeds: [TicketTypeChoosed(user, 'Compras', roles.servidor)], components: [row] })
  },
};

module.exports = { Options };
