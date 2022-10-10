const { serversInfos } = require('../../configs/config_geral');
const { BanirSolicitar } = require('./handle/banirSolicitar');
const { BanirTemp } = require('./handle/banir');
const { Desbanir } = require('./handle/desbanir');
const { ApplicationCommandOptionType } = require('discord.js')
module.exports = {
  name: 'ban',
  description: 'Opções de Ban',
  options: [
    {
      name: 'solicitar', type: ApplicationCommandOptionType.Subcommand, description: 'Solicitar um banimento', options: [
        { name: 'nick', type: ApplicationCommandOptionType.String, description: 'Nick do Player', required: true, choices: null },
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do Player', required: true, choices: null },
        { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Qual servidor ele estava?', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
        { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo do Ban', required: true, choices: null },
        { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player (opcional)', required: false, choices: null },
        { name: 'anydesk', type: ApplicationCommandOptionType.String, description: 'anydesk do player (opcional)', required: false, choices: null },
        { name: 'arquivo1', type: ApplicationCommandOptionType.Attachment, description: 'Prova em imagem (opcional 1)', required: false, choices: null },
        { name: 'arquivo2', type: ApplicationCommandOptionType.Attachment, description: 'Prova em imagem (opcional 2)', required: false, choices: null },
        { name: 'arquivo3', type: ApplicationCommandOptionType.Attachment, description: 'Prova em imagem (opcional 3)', required: false, choices: null },
        { name: 'link', type: ApplicationCommandOptionType.String, description: 'Link (opcional)', required: false, choices: null },
      ]
    },
    {
      name: 'temp', type: ApplicationCommandOptionType.Subcommand, description: 'Para realizar um banimento', options: [
        { name: 'nick', type: ApplicationCommandOptionType.String, description: 'Nick do Player', required: true, choices: null },
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do Player', required: true, choices: null },
        { name: 'tempo', type: ApplicationCommandOptionType.Integer, description: 'Valor em minutos', required: true, choices: null },
        { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo do Ban', required: true, choices: null },
        { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: false, choices: null }
      ]
    },
    {
      name: 'remover', type: ApplicationCommandOptionType.Subcommand, description: 'Para realizar um banimento', options: [
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do Player', required: true, choices: null },
        { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Motivo do Ban', required: true, choices: null }
      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {


    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'solicitar':
        BanirSolicitar(client, interaction,
          interaction.options.getString('nick'),
          interaction.options.getString('steamid'),
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getString('motivo'),
          interaction.options.getUser('discord'),
          interaction.options.getString('anydesk'),
          [
            interaction.options.getAttachment('arquivo1'),
            interaction.options.getAttachment('arquivo2'),
            interaction.options.getAttachment('arquivo3'),
          ],
          interaction.options.getString('link')

        )
        break;
      case 'temp':
        BanirTemp(client, interaction,
          interaction.options.getString('nick'),
          interaction.options.getString('steamid'),
          interaction.options.getInteger('tempo'),
          interaction.options.getString('motivo'),
          interaction.options.getUser('discord'),
        )
        break;
      case 'remover':
        Desbanir(client, interaction,
          interaction.options.getString('steamid'),
          interaction.options.getString('motivo'),
        )
        break;
      default:
        break;
    }
  }
}