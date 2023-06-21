const { MutarTemp } = require('./handle/mutar');
const { Desmutar } = require('./handle/desmutar');
const { ApplicationCommandOptionType } = require('discord.js');
const { getSteamid } = require('../../handle/checks/getSteamid');
module.exports = {
  name: 'mute',
  description: 'Opções de mute',
  options: [
    {
      name: 'temp', type: ApplicationCommandOptionType.Subcommand, description: 'Para realizar um mute', options: [
        { name: 'nick', type: ApplicationCommandOptionType.String, description: 'Nick do Player', required: true, choices: null },
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do Player ou Link do perfil', required: true, choices: null },
        { name: 'tempo', type: ApplicationCommandOptionType.Integer, description: 'Valor em minutos', required: true, choices: null },
        { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo do Mute', required: true, choices: null },
        { name: 'tipo', type: ApplicationCommandOptionType.String, description: 'Tipo do mute', required: true, choices: [{ name: 'MUTE (VOIP)', value: '1' }, { name: 'GAG (CHAT)', value: '2' }] },
      ]
    },
    {
      name: 'remover', type: ApplicationCommandOptionType.Subcommand, description: 'Para remover o mute de uma conta', options: [
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do Player ou Link do perfil', required: true, choices: null },
        { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo da remoção', required: true, choices: null },
        { name: 'tipo', type: ApplicationCommandOptionType.String, description: 'Tipo do mute', required: true, choices: [{ name: 'MUTE (VOIP)', value: '1' }, { name: 'GAG (CHAT)', value: '2' }] },
      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {


    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'temp':
        MutarTemp(client, interaction,
          interaction.options.getString('nick').trim(),
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getInteger('tempo'),
          interaction.options.getString('motivo').trim(),
          interaction.options.getString('tipo'),
        )
        break;
      case 'remover':
        Desmutar(client, interaction,
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getString('motivo').trim(),
          interaction.options.getString('tipo'),
        )
        break;
      default:
        break;
    }
  }
}