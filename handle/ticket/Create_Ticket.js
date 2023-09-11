const { TicketStart, ChannelCreated, TicketServerOptions, TicketLog } = require('./embed');
const { Options } = require('./Options_Ticket');
const { serversInfos } = require('../../configs/config_geral');
const { ChannelType, PermissionFlagsBits, ComponentType } = require('discord.js')
exports.TicketCreate = async function (interaction, client) {

  if (interaction.guild.channels.cache.filter(c => c.parentId == '729848799421530173' && c.topic == interaction.user.id).size > 2)
    return interaction.reply({ content: `**Você já possui o máximo de tickets abertos possíveis!!**`, ephemeral: true }).then(() => setTimeout(() => {
      interaction.webhook.deleteMessage('@original')
    }, 5000))

  await interaction.guild.channels
    .create({
      name: `ticket→${interaction.user.id}`,
      type: ChannelType.GuildText,
      topic: interaction.user.id.toString(),
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
      parent: '729848799421530173',
    })
    .then(async (channel) => {
      interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))
      channel.send(`${interaction.user}`).then((m) => m.delete());
      let msg = await channel.send({ embeds: [TicketStart(interaction.user).embed], components: [TicketStart(interaction.user).lista] });

      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      };

      await channel
        .awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 100000 })
        .then(async (response) => {

          await msg.edit({ embeds: [TicketServerOptions(interaction.user).embed], components: [TicketServerOptions(interaction.user).lista] });
          const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
          };

          await channel
            .awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 100000 })
            .then(async (response2) => {


              const ServerFound = serversInfos.find((f) => f.name == response2.values[0]);

              const ticketOptions = await Options[response.values[0]];

              const roles = {
                servidor: ServerFound.name,
                roleStaff: ServerFound.tagDoCargo,
                roleGerente: ServerFound.gerenteRole,
                roleStaffComprado: ServerFound.tagComprado,
              };

              await interaction.guild.channels.cache.get('757709253766283294').messages.fetch({ limit: 100, force: false }).then(async d => {

                let fieldValue = await d.find(
                  f => f.embeds[0].fields.find(
                    m => m.name.includes('Ação')
                  ).value == 'Criado'
                    &&
                    f.embeds[0].fields.find(
                      m => m.name.includes('Ticket')
                    ).value.length < 20
                )

                let id

                if (!fieldValue) {
                  id = '1'
                } else {
                  fieldValue = fieldValue.embeds[0].fields.find(m => m.name.includes('Ticket')).value

                  id = Number(fieldValue.slice(fieldValue.lastIndexOf('→') + 1)) + 1
                }
                await ticketOptions(channel, interaction.user, roles, msg, id);
                m = await interaction.guild.channels.fetch(channel.id)

                client.channels.cache.get('757709253766283294').send({ embeds: [TicketLog(interaction.user, 'Criado', channel)] });


              })


            })
            .catch((err) => {
              if (err.code !== 'InteractionCollectorError') console.log(err)
              return channel.delete()
            });
        })
        .catch((err) => {
          if (err.code !== 'InteractionCollectorError') console.log(err)
          return channel.delete()
        });
    });
};
