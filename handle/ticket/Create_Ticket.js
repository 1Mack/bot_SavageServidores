const { TicketStart, ChannelCreated, TicketServerOptions } = require('./embed');
const { Options } = require('./Options_Ticket');
const { serversInfos } = require('../../configs/config_geral');
exports.TicketCreate = async function (interaction, client) {
  
    let guild = client.guilds.cache.get('343532544559546368');

    await guild.channels
        .create(`ticket→${interaction.user.id}`, {
            type: 'text',
            topic: interaction.user.id.toString(),
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '729848799421530173',
        })
        .then(async (m) => {
            interaction.reply({embeds: [ChannelCreated(interaction.user, m)], ephemeral: true});
            m.send(`${interaction.user}`).then((m) => m.delete());
            await m.send({embeds: [TicketStart(interaction.user).embed], components: [TicketStart(interaction.user).lista]});

            const filter = i => {
                i.deferUpdate();
                return i.user.id === interaction.user.id;
            };

            await m
                .awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 45000})
                .then(async (response) => {
                    await m.bulkDelete(10);

                    await m.send({embeds: [TicketServerOptions(interaction.user).embed], components: [TicketServerOptions(interaction.user).lista]});
                    const filter = i => {
                        i.deferUpdate();
                        return i.user.id === interaction.user.id;
                    };

                    await m
                        .awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 45000})
                        .then(async (response2) => {
                         
                             await m.bulkDelete(10);

                            const ServerFound = serversInfos.find((f) => f.name == response2.values[0]);

                            const ticketOptions = Options[response.values[0]];

                            const roles = {
                                servidor: ServerFound.name,
                                roleStaff: ServerFound.tagDoCargo,
                                roleGerente: ServerFound.gerenteRole,
                                roleStaffComprado: ServerFound.tagComprado,
                            };

                            ticketOptions(m, interaction.user, roles); 
                        })
                        .catch((error) => {
                            return m.delete(), console.log(error);
                        });
                })
                .catch(() => {
                    return m.delete();
                });
        });
};
