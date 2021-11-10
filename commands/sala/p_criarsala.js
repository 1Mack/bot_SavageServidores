module.exports = {
    name: 'criarsala',
    description: 'Criar uma sala privada',
    options: [{name: 'nome', type: 3, description: 'Digite o nome da sala que você quer criar', required: true, choices: null}],
    default_permission: true,
    cooldown: 0,
    permissions: [],
    async execute(client, interaction) {
        let nomeSala = interaction.options.getString('nome')

        let LogChannel = client.channels.cache.get('840936627839828068');

        await LogChannel.messages.fetch().then((m) => {
            let ChannelFind = m.find((c) => c.content.includes(interaction.user.id));
            if (ChannelFind != undefined) {
                return interaction.reply({content: `Você já possui um canal → ${ChannelFind}`}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
            }

            interaction.guild.channels
                .create(nomeSala, {
                    type: 'GUILD_VOICE',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: interaction.user.id,
                            allow: ['VIEW_CHANNEL', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS'],
                        },
                    ],
                    parent: '840826127999565894',
                })
                .then(async (channel) => {
                    let msgLog = await LogChannel.send({content: `${interaction.user} criou o canal ${channel}`});
                    interaction.reply({content:
                            `Canal ${channel} criado com sucesso\n**Obs: Você tem 30 segundos para entrar no canal, caso contrário ele será excluído!!**`
                        })
                        .then(() => setTimeout(() => interaction.deleteReply(), 10000));
                    setTimeout(() => {
                         if (interaction.member.voice.channelId != channel.id) {
                            channel.delete();
                            msgLog.delete();
                        }  
                    }, 30000);
                })
        });
    },
};
