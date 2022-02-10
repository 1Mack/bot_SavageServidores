const { formFunction } = require('./formFunction');
const { formFunction2 } = require('./formFunction2')
const { connection } = require('../../configs/config_privateInfos');
const { HasAlreadyChannel, FormStart, ChannelCreated } = require('./embed');
exports.FormCreate = async function (interaction, client) {
    const canalFind = () => interaction.guild.channels.cache.find((m) => m.name.includes(`form→${interaction.user.id}`));

    if (canalFind()) {
        return (
            interaction.reply({ embeds: [HasAlreadyChannel(interaction.user, canalFind())], ephemeral: true })
            //formFunction(interaction.user, false, canalFind(), client)
        );
    }
    let conn = connection.promise();

    let [result] = await conn.query(`select discord_id from form_respostas_2Etapa where discord_id = '${interaction.user.id}'`);

    if (result != '') {
        result = false;
    }

    await interaction.guild.channels
        .create(`form→${interaction.user.id}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '936310042225934408',
        })
        .then(async (channel) => {

            if (!result) {
                return (formFunction2(interaction.user, channel, client, false, 'ChooseServer'),
                    interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true })
                )
            }
            let msg = await channel.send({ content: `${interaction.user}`, embeds: [FormStart(interaction.user).embed], components: [FormStart(interaction.user).lista] });


            interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true })

            const filter = i => {
                i.deferUpdate();
                return i.user.id == interaction.user.id && i.channelId == channel.id;
            };

            await channel
                .awaitMessageComponent({ filter, time: 45000, errors: ['time'] })
                .then(() => {
                    formFunction(interaction.user, true, channel, msg, client);
                })
                .catch(() => {
                    return channel.delete();
                });
        });
};
