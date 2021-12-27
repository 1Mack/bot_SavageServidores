const { MessageEmbed } = require('discord.js');
const { WrongUsage } = require('./embed');

module.exports = {
    name: 'embed',
    description: 'Enviar Embeds',
    options: [

        { name: 'color', type: 3, description: 'Cor no formato HexColor, exemplo → 36393f', required: false, choices: null },
        { name: 'title', type: 3, description: 'Título', required: false, choices: null },
        { name: 'description', type: 3, description: 'Descrição', required: false, choices: null },
        { name: 'image', type: 3, description: 'Link da imagem', required: false, choices: null },
        { name: 'reactions', type: 3, description: 'Reações para adicionar. Tem que por espaço entre as reações junto com vírgula, exemplo → 👍, 😋', required: false, choices: null },
        { name: 'footer', type: 3, description: 'Texto no rodapé', required: false, choices: null },
        { name: 'timestamp', type: 5, description: 'Adicionar hora?', required: false, choices: null },
        
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '831219575588388915', type: 1, permission: true }],//Perm Set
    async execute(client, interaction) {
        let color = interaction.options.getString('color'),
            title = interaction.options.getString('title'),
            description = interaction.options.getString('description'),
            image = interaction.options.getString('image'),
            reactions = interaction.options.getString('reactions'),
            footer = interaction.options.getString('footer'),
            timestamp = interaction.options.getBoolean('timestamp')


        if (!title && !description && !image) {
            return interaction.reply({ embeds: [WrongUsage(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }
        const embed = new MessageEmbed()

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
            embed.setFooter(footer);
        }
        if (timestamp) {
            embed.setTimestamp();
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
