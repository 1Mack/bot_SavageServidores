const { TicketStart, ChannelCreated, TicketServerOptions } = require('./embed');
const { Options } = require('./Options_Ticket');
const { serversInfos } = require('../../configs/config_geral');
exports.TicketCreate = async function (interaction, client) {

    if (interaction.guild.channels.cache.filter(c => c.name.includes('ticket') && c.topic == interaction.user.id).size > 2)
        return interaction.reply({ content: `**Você já possui o máximo de tickets abertos possíveis!!**`, ephemeral: true })

    await interaction.guild.channels
        .create(`ticket→${interaction.user.id}`, {
            type: 'text',
            topic: interaction.user.id.toString(),
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '729848799421530173',
        })
        .then(async (m) => {
            interaction.reply({ embeds: [ChannelCreated(interaction.user, m)], ephemeral: true });
            m.send(`${interaction.user}`).then((m) => m.delete());
            let msg = await m.send({ embeds: [TicketStart(interaction.user).embed], components: [TicketStart(interaction.user).lista] });

            const filter = i => {
                i.deferUpdate();
                return i.user.id === interaction.user.id;
            };

            await m
                .awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 100000 })
                .then(async (response) => {

                    await msg.edit({ embeds: [TicketServerOptions(interaction.user).embed], components: [TicketServerOptions(interaction.user).lista] });
                    const filter = i => {
                        i.deferUpdate();
                        return i.user.id === interaction.user.id;
                    };

                    await m
                        .awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 45000 })
                        .then(async (response2) => {


                            const ServerFound = serversInfos.find((f) => f.name == response2.values[0]);

                            const ticketOptions = Options[response.values[0]];

                            const roles = {
                                servidor: ServerFound.name,
                                roleStaff: ServerFound.tagDoCargo,
                                roleGerente: ServerFound.gerenteRole,
                                roleStaffComprado: ServerFound.tagComprado,
                            };

                            ticketOptions(m, interaction.user, roles, msg);
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
