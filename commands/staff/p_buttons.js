const { ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const { WrongUsage } = require('./embed');
module.exports = {
  name: 'buttons',
  description: 'Enviar botão',
  options: [

    { name: 'msgid', type: ApplicationCommandOptionType.String, description: 'Id da msg para por o botão', required: true, choices: null },
    { name: 'buttonid', type: ApplicationCommandOptionType.String, description: 'Id para por no botão (se for mais de 1, basta por mais de 1 id → Id1, Id2...)', required: true, choices: null },

    {
      name: 'buttonstyle', type: ApplicationCommandOptionType.Integer, description: 'Estilo do botão', required: true, choices:
        [
          { name: 'danger', value: ButtonStyle.Danger },
          { name: 'link', value: ButtonStyle.Link },
          { name: 'primary', value: ButtonStyle.Primary },
          { name: 'secondary', value: ButtonStyle.Secondary },
          { name: 'success', value: ButtonStyle.Success },
        ],

    },
    { name: 'buttonname', type: ApplicationCommandOptionType.String, description: 'Nome para por no botão', required: false, choices: null },
    { name: 'buttonemoji', type: ApplicationCommandOptionType.String, description: 'Emoji para por no botão', required: false, choices: null },
    { name: 'buttonurl', type: ApplicationCommandOptionType.String, description: 'Url para por no botão', required: false, choices: null },
    { name: 'buttondisabled', type: ApplicationCommandOptionType.Boolean, description: 'Desabilitar Botão?', required: false, choices: null },

  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let msgId = interaction.options.getString('msgid'),
      buttonId = interaction.options.getString('buttonid'),
      buttonName = interaction.options.getString('buttonname'),
      buttonEmoji = interaction.options.getString('buttonemoji') || false,
      buttonStyle = interaction.options.getInteger('buttonstyle'),
      buttonURL = interaction.options.getString('buttonurl') || false,
      buttonDisabled = interaction.options.getBoolean('buttondisabled')


    if (!buttonName && !buttonEmoji || (buttonStyle != ButtonStyle.Link && buttonURL)) {
      return interaction.reply({ embeds: [WrongUsage(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }

    await interaction.deferReply()


    const row = new ActionRowBuilder()
    buttonId = buttonId.split(', ')
    if (buttonName) buttonName = buttonName.split(', ')
    if (buttonURL) buttonURL = buttonURL.split(', ')
    if (buttonEmoji) buttonEmoji = buttonEmoji.split(', ')

    for (let i in buttonId) {
      row.addComponents(new ButtonBuilder()
        .setLabel(buttonName[i] ? buttonName[i] : '')
        .setCustomId(buttonId[i])
        .setEmoji(buttonEmoji[i] ? buttonEmoji[i] : '')
        .setURL(buttonURL[i] ? buttonURL[i] : '')
        .setDisabled(buttonDisabled ? buttonDisabled : false)
        .setStyle(buttonStyle)
      )
    }

    try {
      interaction.channel.messages.fetch(msgId).then(m => m.edit({ components: [row] }))
    } catch (err) {
      interaction.followUp({ content: 'Houve um erro!', ephemeral: true })
      console.log(err)
    }
  },
};
