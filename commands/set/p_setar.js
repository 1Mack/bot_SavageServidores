const { serversInfos, serverGroups } = require('../../configs/config_geral');
const { Comprado } = require('./handle/comprado');
const { Comprado_Loja } = require('./handle/loja');
const { Staff } = require('./handle/normal');
const { UP_Procurar_merecedores } = require('./handle/procurar_merecedores');
const { UP_Especifico } = require('./handle/up_especifico');

const { ApplicationCommandOptionType } = require('discord.js');
const { Store_Skins } = require('./handle/store_skins');
const { Store_Credits } = require('./handle/store_credits');
const { getSteamid } = require('../../handle/checks/getSteamid');
const { CriarServidor } = require('./handle/criar');

module.exports = {
  name: 'setar',
  description: 'Setar um cargo para algum player',
  options: [
    {
      name: 'comprado', type: ApplicationCommandOptionType.SubcommandGroup, description: 'Para cargos comprados', options: [
        {
          name: 'loja', type: ApplicationCommandOptionType.Subcommand, description: 'Para cargos comprados pela loja', options: [
            { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null },
            { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }).concat({ name: 'all', value: 'all' }) },
            { name: 'steamid_idcompra', type: ApplicationCommandOptionType.String, description: 'Steamid do comprador, Link do perfil ou o ID da compra', required: true, choices: null },
          ]
        },
        {
          name: 'discord', type: ApplicationCommandOptionType.Subcommand, description: 'Para cargos comprados pelo discord', options: [
            { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null },
            { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do player ou Link do perfil', required: true, choices: null },
            {
              name: 'cargo', type: ApplicationCommandOptionType.String, description: 'Escolha um cargo para o Set', required: true, choices: Object.keys(serverGroups).filter(
                m => m.endsWith('p') || m == 'vip' || m == 'gerente' || m == 'princesa'
              ).map(
                m => { return { name: m, value: m } }
              )
            },
            { name: 'tempo', type: ApplicationCommandOptionType.Integer, description: 'Tempo em dias do set', required: true, choices: null },
            { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }).concat({ name: 'all', value: 'all' }) },
            { name: 'observações', type: ApplicationCommandOptionType.String, description: 'Observações sobre o set', required: false, choices: null }
          ]
        }
      ]
    },
    {
      name: 'servidor', type: ApplicationCommandOptionType.SubcommandGroup, description: 'Para cargos comprados', options: [
        {
          name: 'criar', type: ApplicationCommandOptionType.Subcommand, description: 'Solicitar um banimento', options: [
            {
              name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamids ou link do perfl dos Players separados por vírgula', required: true, choices: null
            },
            { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Qual servidor será', required: true, choices: [{ name: 'mix', value: 'mix' }, { name: 'retake', value: 'retake' }] },
            { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null },
            { name: 'tempo', type: ApplicationCommandOptionType.Integer, description: 'Valor em dias', required: true, choices: null },
            { name: 'valor', type: ApplicationCommandOptionType.String, description: 'Valor diferente do site? Se sim, qual?', required: false, choices: null },
            { name: 'serverid', type: ApplicationCommandOptionType.String, description: 'Quer setar um servidor específico? Se sim, qual?', required: false, choices: null }
          ]
        },
      ]
    },
    {
      name: 'staff', type: ApplicationCommandOptionType.Subcommand, description: 'Para cargos normais de staff', options: [
        { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null },
        { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'Steamid do player ou Link do perfil', required: true, choices: null },
        {
          name: 'cargo', type: ApplicationCommandOptionType.String, description: 'Escolha um cargo para o Set', required: true, choices: Object.keys(serverGroups).filter(
            m => !m.endsWith('p') && m != 'vip' && m != 'gerente' && m != 'princesa'
          ).map(
            m => { return { name: m, value: m } }
          )
        },
        { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }).concat({ name: 'all', value: 'all' }) },
        { name: 'observações', type: ApplicationCommandOptionType.String, description: 'Observações sobre o set', required: true, choices: null }
      ]
    },
    {
      name: 'up', type: ApplicationCommandOptionType.SubcommandGroup, description: 'Upar um staff', options: [
        {
          name: 'especifico', type: ApplicationCommandOptionType.Subcommand, description: 'Upar um staff especifico', options: [
            { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },
            { name: 'motivo', type: ApplicationCommandOptionType.String, description: 'Movito do UP', required: true, choices: null },
            { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: false, choices: null },
            { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'steamid do player ou Link do perfil', required: false, choices: null },
          ]
        },
        {
          name: 'procurar_merecedores', type: ApplicationCommandOptionType.Subcommand, description: 'Ver quais staffs merecem ser upado', options: [
            { name: 'servidor', type: ApplicationCommandOptionType.String, description: 'Escolha um Servidor para o Set', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) },

          ]
        }

      ]
    },
    {
      name: 'store', type: ApplicationCommandOptionType.SubcommandGroup, description: 'Dar algum item na loja', options: [
        {
          name: 'creditos', type: ApplicationCommandOptionType.Subcommand, description: 'Dar creditos', options: [
            { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'steamid do player ou Link do perfil', required: true, choices: null },
            { name: 'total_creditos', type: ApplicationCommandOptionType.Integer, description: 'Valor de creditos', required: true, choices: null },
          ]
        },
        {
          name: 'skins', type: ApplicationCommandOptionType.Subcommand, description: 'Dar skins', options: [
            { name: 'steamid', type: ApplicationCommandOptionType.String, description: 'steamid do player ou Link do perfil', required: true, choices: null },
            {
              name: 'skin', type: ApplicationCommandOptionType.String, description: 'Selecionar Skin', required: true, choices: [
                { name: 'ET', value: 'uid_model_et' },
                { name: 'Homem Aranha', value: 'uid_model_homem_aranha' },
                { name: 'Miyu', value: 'uid_model_miyu' },
                { name: 'Batman', value: 'uid_model_batman' },
                { name: 'Jett', value: 'uid_model_jett' },
                { name: 'hutao', value: 'uid_model_hutao' },
                { name: 'Nekopara', value: 'uid_model_homem_nekopara' },
                { name: 'KillJoy', value: 'uid_model_killjoy' },
                { name: 'Putin', value: 'uid_model_putin' },
                { name: 'DeadPool', value: 'uid_model_deadpool' },

              ]
            },
          ]
        }

      ]
    },
  ],
  default_permission: false,
  cooldown: 0,

  async execute(client, interaction) {

    const command = interaction.options.getSubcommand()

    switch (command) {
      case 'loja':

        Comprado_Loja(client, interaction,
          interaction.options.getUser('discord'),
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getString('steamid_idcompra').includes('http') ?
            await getSteamid(interaction.options.getString('steamid_idcompra')) :
            interaction.options.getString('steamid_idcompra').replace(/[^a-zA-Z_:0-9]/g, ''),
        )
        break;
      case 'discord':
        Comprado(client, interaction,
          interaction.options.getUser('discord'),
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getString('cargo').toLowerCase(),
          interaction.options.getInteger('tempo'),
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getString('observações')
        )
        break;
      case 'staff':
        Staff(client, interaction,
          interaction.options.getUser('discord'),
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getString('cargo').toLowerCase(),
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getString('observações')
        )
        break;
      case 'criar':
        CriarServidor(client, interaction,
          interaction.options.getString('steamid').replace(/[^a-zA-Z_:,0-9]/g, ''),
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getUser('discord'),
          interaction.options.getInteger('tempo'),
          interaction.options.getString('valor'),
          interaction.options.getString('serverid'),
          true,
        )
        break;
      case 'especifico':
        UP_Especifico(client, interaction,
          interaction.options.getString('servidor').toLowerCase(),
          interaction.options.getString('motivo'),
          interaction.options.getUser('discord') || interaction.options.getString('steamid') ?
            interaction.options.getString('steamid').includes('http') ?
              await getSteamid(interaction.options.getString('steamid')) :
              interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, '') :
            null
        )
        break;
      case 'procurar_merecedores':
        UP_Procurar_merecedores(client, interaction,
          interaction.options.getString('servidor').toLowerCase(),
        )
        break;
      case 'creditos':
        Store_Credits(client, interaction,
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getInteger('total_creditos')
        )
        break;
      case 'skins':
        Store_Skins(client, interaction,
          interaction.options.getString('steamid').includes('http') ?
            await getSteamid(interaction.options.getString('steamid')) :
            interaction.options.getString('steamid').replace(/[^a-zA-Z_:0-9]/g, ''),
          interaction.options.getString('skin')
        )
        break;
      default:
        break;
    }
  }
}