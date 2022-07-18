const { Sala_Convidar } = require('./handle/convidar');
const { Sala_Criar } = require('./handle/criarsala');

const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'sala',
  description: 'Comandos de configuração de sala',
  options: [
    {
      name: 'criar', type: ApplicationCommandOptionType.Subcommand, description: 'Para criar uma sala privada', options: [
        { name: 'nome', type: ApplicationCommandOptionType.String, description: 'Nome da Sala', required: true, choices: null },

      ]
    },
    {
      name: 'convidar', type: ApplicationCommandOptionType.Subcommand, description: 'Para convidar alguém para a sua sala privada', options: [
        { name: 'discord', type: ApplicationCommandOptionType.User, description: 'Discord do player', required: true, choices: null }
      ]
    },
  ],
  default_permission: true,
  cooldown: 0,

  async execute(client, interaction) {

    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'criar':
        Sala_Criar(interaction, client,
          interaction.options.getString('nome'),

        )
        break;
      case 'convidar':
        Sala_Convidar(interaction, client,
          interaction.options.getUser('discord')
        )
        break;
      default:
        break;
    }
  }
}