const { LogAdv, AdvSuccess, AdvWarning } = require('./embed');

module.exports = {
    name: 'adv',
    description: 'Aplicar advertência em um staff',
    options: [
        {name: 'discord', type: 6, description: 'discord do player', required: true, choices: null},
        {name: 'motivo', type: 3, description: 'Motivo da AVD', required: true, choices: null}
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}, {id: '831219575588388915', type: 1, permission: true}],
    async execute(client, interaction) {
        let discord1 = interaction.options.getUser('discord'),
            reason = interaction.options.getString('motivo'),
            userCatch = client.guilds.cache.get('343532544559546368').members.cache.get(discord1.id);

        let adv;

        if (
            !userCatch._roles.find((roles) => roles == '607704706088828955') &&
            !userCatch._roles.find((roles) => roles == '607704708051894272')
        ) {
            userCatch.roles.add('607704706088828955');
            adv = '1';
        } else if (
            userCatch._roles.find((roles) => roles == '607704706088828955') &&
            userCatch._roles.find((roles) => roles == '607704708051894272')
        ) {
            return client.channels.cache
                .get('751428595536363610')
                .send(interaction.reply({embeds: [AdvWarning(interaction, discord1)]}));
        } else {
            userCatch.roles.add('607704708051894272');
            adv = '2';
        }

        interaction.reply({embeds: [AdvSuccess(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        client.channels.cache.get('779013964138414090').send({embeds: [LogAdv(discord1, adv, reason, interaction)]});
    },
};