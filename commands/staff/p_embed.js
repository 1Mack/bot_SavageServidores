const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { WrongUsage } = require('./embed');

module.exports = {
  name: 'embed',
  description: 'Enviar Embeds',
  options: [

    { name: 'color', type: ApplicationCommandOptionType.String, description: 'Cor no formato HexColor, exemplo → 36393f', required: false, choices: null },
    { name: 'title', type: ApplicationCommandOptionType.String, description: 'Título', required: false, choices: null },
    { name: 'description', type: ApplicationCommandOptionType.String, description: 'Descrição', required: false, choices: null },
    { name: 'image', type: ApplicationCommandOptionType.String, description: 'Link da imagem', required: false, choices: null },
    { name: 'reactions', type: ApplicationCommandOptionType.String, description: 'Reações para adicionar. Tem que por espaço entre as reações junto com vírgula, exemplo → 👍, 😋', required: false, choices: null },
    { name: 'footer', type: ApplicationCommandOptionType.String, description: 'Texto no rodapé → Texto;url', required: false, choices: null },
    { name: 'timestamp', type: ApplicationCommandOptionType.Boolean, description: 'Adicionar hora?', required: false, choices: null },
    { name: 'thumbnail', type: ApplicationCommandOptionType.String, description: 'Adicionar thumbnail?', required: false, choices: null },

  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let color = interaction.options.getString('color'),
      title = interaction.options.getString('title'),
      description = interaction.options.getString('description'),
      image = interaction.options.getString('image'),
      reactions = interaction.options.getString('reactions'),
      footer = interaction.options.getString('footer'),
      timestamp = interaction.options.getBoolean('timestamp'),
      thumbnail = interaction.options.getString('thumbnail')


    if (!title && !description && !image) {
      return interaction.reply({ embeds: [WrongUsage(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
    }
    const embed = new EmbedBuilder()

    if (color) {
      embed.setColor(`#${color}`);
    }
    if (title) {
      embed.setTitle(title);
    }
    if (description) {
      description = description.replace(/\\n/g, '\n')
      embed.setDescription(description);
    }
    if (image) {
      if (image.includes('http') || image.includes('https')) {
        embed.setImage(image);
      }
    }
    if (footer) {
      footer = footer.split(';')
      if(footer.length == 2) {
        if(footer[1].includes('http') || footer[1].includes('https')){
          embed.setFooter({ text: footer[0], iconURL: footer[1] });
        }
      }else {
         if(footer[0].includes('http') || footer[0].includes('https')){
          embed.setFooter({ iconURL: footer[0] });
        }else {
          embed.setFooter({ text: footer[0] });
        }
      }
    }
    if (timestamp) {
      embed.setTimestamp();
    }
    if (thumbnail) {
      if (thumbnail.includes('http') || thumbnail.includes('https')) {
        embed.setThumbnail(thumbnail);
      }
    }
    try {
      if (reactions) {
        reactions = reactions.split(', ')
        await interaction.deferReply()
        let msg = await interaction.channel.send({ embeds: [embed] })

        for (let i in reactions) {
          await msg.react(reactions[i]);
        }
        ;
      } else {
        interaction.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      return interaction.editReply({ content: `${interaction.user} **| Voce escreveu algo errado`, embeds: [] })
        ||
        interaction.reply({ content: `${interaction.user} **| Voce escreveu algo errado`, embeds: [] })
    }

  },
};
