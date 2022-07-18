const { WrongChannel, SugestaoLog } = require('./embed');
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'sugestao',
  description: 'Sugerir algo para o servidor',
  options: [{ name: 'sugestao', type: ApplicationCommandOptionType.String, description: 'Sua sugestão', required: true, choices: null }],
  default_permission: true,
  cooldown: 30,
  async execute(client, interaction) {

    let sugestao = interaction.options.getString('sugestao')



    client.channels.cache
      .get('778411417291980830')
      .send({ embeds: [SugestaoLog(interaction, sugestao)] })
      .then(async (message) => {
        await message.react('778432828148023297')
        await message.react('778432818862227526')
      });
    interaction.reply({ content: '<a:right_savage:856211226300121098> **Sugestão enviada com sucesso!**', ephemeral: true })

  },
};
