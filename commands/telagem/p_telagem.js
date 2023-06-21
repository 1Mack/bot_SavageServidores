const { ApplicationCommandOptionType } = require('discord.js');
const { Telar } = require('./telar');
const { PastaID } = require('./idPasta');
module.exports = {
  name: 'telagem',
  description: 'Comandos de Telagem',
  options: [
    {
      name: 'telar', type: ApplicationCommandOptionType.Subcommand, description: 'Solicitar uma telagem', options: [
        { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player (opcional)', required: false, choices: null },
      ]
    },
    {
      name: 'steam3id', type: ApplicationCommandOptionType.Subcommand, description: 'Descobrir steam3ID', options: [
        { name: 'id', type: ApplicationCommandOptionType.String, description: 'IDs da pasta do player separados por virgula -> 123456, 789123', required: true, choices: null },
      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {


    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'telar':
        Telar(client, interaction,
          interaction.options.getUser('discord'),
        )
        break;
      case 'steam3id':
        PastaID(client, interaction,
          interaction.options.getString('id')
        )
        break;
      default:
        break;
    }
  }
}