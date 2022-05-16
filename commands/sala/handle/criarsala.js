const { guildsInfo } = require('../../../configs/config_geral');

const wait = require('util').promisify(setTimeout);

exports.Sala_Criar = async function (interaction, client, nomeSala) {

    let LogChannel = client.channels.cache.get('840936627839828068');

    await LogChannel.messages.fetch().then(async (m) => {
        let ChannelFind = m.find((c) => c.content.includes(interaction.user.id));
        if (ChannelFind != undefined) {
            return interaction.reply({ content: `Você já possui um canal → ${ChannelFind}` }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }

        await interaction.guild.channels
            .create(nomeSala, {
                type: 'GUILD_VOICE',
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
            .then(async (voiceChannel) => {
                let msgLog = await LogChannel.send({ content: `${interaction.user} criou o canal ${voiceChannel}` });
                interaction.reply({
                    content:
                        `[Canal ${voiceChannel.name.toUpperCase()} criado com sucesso](https://discord.com/channels/${guildsInfo.main}/${voiceChannel.id})\n**Obs: Você tem 30 segundos para entrar no canal, caso contrário ele será excluído!!**`,
                    ephemeral: true
                })

                await wait(30000)

                if (interaction.member.voice.channelId != voiceChannel.id) {
                    voiceChannel.delete();
                    msgLog.delete();
                }
            })

    });
};
