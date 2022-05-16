const { functionCargos } = require('../handle/extras/buttons/roles')

module.exports = {
    name: 'interactionCreate',
    once: 'on',
    async execute(interaction, client) {

        if (interaction.isButton()) {

            const setCargos = functionCargos[interaction.customId];

            if (setCargos) {
                setCargos(interaction, client)
            } else return;
        }
        if (!interaction.isCommand()) return;

        if (!client.commands.has(interaction.commandName)) return;
        try {
            await client.commands.get(interaction.commandName).execute(client, interaction);
        } catch (error) {

            console.error(error)

            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(() => { })
        }
    },
};
