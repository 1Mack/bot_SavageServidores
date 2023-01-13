const { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { guildsInfo } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: 'telar',
  description: 'Telar um player',
  options: [
    { name: 'discord', type: ApplicationCommandOptionType.User, description: 'discord do player', required: true, choices: null }
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let discordID = interaction.options.getUser('discord');

    let findChannel = await interaction.guild.channels.cache.find(ch => ch.name === `telando→${discordID.id}`)

    if (findChannel)
      return interaction.reply({ content: `[Já existe um canal de telagem para esse usuário](https://discord.com/channels/${guildsInfo.main}/${findChannel.id})`, ephemeral: true })
        .then(() => setTimeout(() => {
          interaction.webhook.deleteMessage('@original')
        }, 5000))

    await interaction.guild.channels
      .create({
        name: `telando→${discordID.id}→${interaction.user.id}`,
        type: ChannelType.GuildVoice,
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: '800826968417108028',
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: discordID.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
        parent: '936310042225934408',
      }).then(async (voiceChannel) => {

        interaction.reply({
          content:
            `[Canal criado com sucesso](https://discord.com/channels/${guildsInfo.main}/${voiceChannel.id})\n**Obs: Você tem 30 segundos para entrar no canal, caso contrário ele será excluído!!**`,
          ephemeral: true
        }).then(() => setTimeout(() => {
          interaction.webhook.deleteMessage('@original')
        }, 5000))

        discordID.send({ content: `Ei ${discordID}, sua sala para telagem ja foi criada → https://discord.com/channels/${guildsInfo.main}/${voiceChannel.id}` })

        await wait(30000)

        if (interaction.member.voice.channelId != voiceChannel.id) return voiceChannel.delete();

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('telando_cancelar')
            .setLabel('ENCERRAR SALA')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('telando_banir')
            .setLabel('BANIR')
            .setStyle(ButtonStyle.Danger)

        )
        voiceChannel.send({ content: `${interaction.user}`, components: [button] })

      })
  },
};
