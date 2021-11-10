module.exports = {
    name: 'convidar',
    description: 'Convidar alguém para uma sala',
    options: [{name: 'discord', type: 6, description: 'Marque a pessoa que queira convidar para a sua sala', required: true, choices: null}],
    default_permission: true,
    cooldown: 0,
    permissions: [],
    async execute(client, interaction) {
        let discordMention = interaction.options.getUser('discord')

        
        let LogChannel = client.channels.cache.get('840936627839828068');

         await LogChannel.messages.fetch().then((m) => {
            let channelFind = m.find((c) => c.content.includes(interaction.user.id));
            if (channelFind == undefined) {
                return interaction.reply({content: 'Você não possui um canal!\nEscreva /sala para criar um!!'})
                    .then(() => setTimeout(() => interaction.deleteReply(), 10000));
            } 

            if(discordMention == interaction.user) return interaction.reply({content: `Ta doido ${interaction.user}, tu quer se convidar pro seu próprio canal???`})
            .then(() => setTimeout(() => interaction.deleteReply(), 10000))

            channelFind = channelFind.content.slice(-19, -1)
            try {
                interaction.guild.channels.cache
                    .get(channelFind)
                    .permissionOverwrites.edit(discordMention, {
                        VIEW_CHANNEL: true,
                    });
            } catch (error) {
                return interaction.reply({content: 
                        'Não consegui convidar esse usuário.\nVeja se você possui uma sala ou se você marcou o usuário de forma errada!!'
                    }, console.log(error))
                    .then(() => setTimeout(() => interaction.deleteReply(), 10000));
            }
        
            interaction.reply({content: `<a:right_savage:856211226300121098> **O ${discordMention.username} foi convidado com sucesso!**`}).then(() => interaction.deleteReply(), 10000)
            discordMention.send({content: `<a:zoomer:650795626715414531> Ei ${discordMention}, o **${interaction.user}** te convidou para o canal de voz dele → <#${channelFind}>\n\n***Sem broderagem em, to de  👀***`})
        });
    },
};
