const { guildsInfo } = require('../../configs/config_geral');
const { LogAdv, AdvSuccess, AdvWarning } = require('./embed');

const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'telar',
  description: 'Telar um player',
  options: [
    { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null },
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let discord1 = interaction.guild.members.cache.get(interaction.options.getUser('discord'));

    
  },
};
