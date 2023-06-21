const { ApplicationCommandOptionType } = require('discord.js');
const { AdminServidorAdicionar } = require('./handle/admin/adicionar');
const { SenhaServidor } = require('./handle/senha');
const { EnergiaServidor } = require('./handle/power');
const { AdminServidorRemover } = require('./handle/admin/remover');
const { CommandServidor } = require('./handle/command');

module.exports = {
  name: 'servidor',
  description: 'Servidor privado',
  options: [
    {
      name: 'admin', type: ApplicationCommandOptionType.SubcommandGroup, description: 'Para adicionar ou remover um admin', options: [
        {
          name: 'adicionar', type: ApplicationCommandOptionType.Subcommand, description: 'Para adicionar', options: [
            {
              name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamids ou link do perfl dos Players separados por vírgula', required: true, choices: null
            },
          ]
        },
        {
          name: 'remover', type: ApplicationCommandOptionType.Subcommand, description: 'Para remover', options: [
            {
              name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamids ou link do perfl dos Players separados por vírgula', required: true, choices: null
            },
          ]
        }
      ]
    },
    {
      name: 'senha', type: ApplicationCommandOptionType.Subcommand, description: 'Para realizar um banimento', options: [
        {
          name: 'senha', type: ApplicationCommandOptionType.String, description: 'Nova senha', required: true, choices: null
        },
      ]
    },
    {
      name: 'energia', type: ApplicationCommandOptionType.Subcommand, description: 'Para reiniciar ou desligar o servidor', options: [
        {
          name: 'energia', type: ApplicationCommandOptionType.String, description: 'Tipo de energia', required: true, choices: [{ name: 'Reiniciar', value: 'restart' }, { name: 'Desligar', value: 'stop' }]
        },
      ]
    },
    {
      name: 'comando', type: ApplicationCommandOptionType.Subcommand, description: 'Para enviar um comando ao console', options: [
        {
          name: 'comando', type: ApplicationCommandOptionType.String, description: 'Qual comando? Exemplo: sm_map dust2', required: true, choices: []
        },
      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {


    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'adicionar':
        AdminServidorAdicionar(interaction, interaction.options.getString('steamid').replace(/\s/g, '').split(','))
        break;
      case 'remover':
        AdminServidorRemover(interaction, interaction.options.getString('steamid').replace(/\s/g, '').split(','))
        break;
      case 'senha':
        SenhaServidor(interaction, interaction.options.getString('senha'))
        break;
      case 'energia':
        EnergiaServidor(interaction, interaction.options.getString('energia'))
        break;
      case 'comando':
        CommandServidor(interaction, interaction.options.getString('comando'))
        break;
      default:
        break;
    }
  }
} 