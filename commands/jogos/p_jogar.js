const { CampoMinado } = require('./campominado')
const { ApplicationCommandOptionType } = require('discord.js')
const { CoinFlip } = require('./coinflip')

module.exports = {
  name: 'jogar',
  description: 'Jogar um jogo',
  options: [
    {
      name: 'campominado', type: ApplicationCommandOptionType.Subcommand, description: 'Para jogar campo minado', options: [
        {
          name: 'bombs', type: ApplicationCommandOptionType.Integer, description: 'Total de Bombas', required: true, choices: [
            { name: '1 (0.0005x)', value: 1 },
            { name: '3 (0.0015x)', value: 3 }, { name: '5 (0.0025x)', value: 5 }, { name: '10 (0.005x)', value: 10 }
          ]
        },
        { name: 'creditos', type: ApplicationCommandOptionType.Integer, description: 'Total de créditos para apostar', required: true, choices: null }
      ]
    },
    {
      name: 'coinflip', type: ApplicationCommandOptionType.Subcommand, description: 'Para jogar coinflip', options: [
        {
          name: 'lado', type: ApplicationCommandOptionType.String, description: 'Escolha CT ou TR', required: true, choices: [
            { name: 'CT', value: 'CT' },
            { name: 'TR', value: 'TR' }
          ]
        },
        { name: 'creditos', type: ApplicationCommandOptionType.Integer, description: 'Total de créditos para apostar', required: true, choices: null }
      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {

    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'campominado':
        CampoMinado(client, interaction,
          interaction.options.getInteger('bombs'),
          interaction.options.getInteger('creditos'),
        )
        break;
      case 'coinflip':
        CoinFlip(client, interaction,
          interaction.options.getString('lado'),
          interaction.options.getInteger('creditos'),
        )
        break;
      default:
        break;
    }
  }
}