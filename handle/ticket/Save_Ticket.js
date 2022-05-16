const fs = require('fs');
const { TicketLog } = require('./embed');
exports.Save = async function (interaction, client) {
    await interaction.channel.messages.fetch({ limit: 100 }).then(async (response) => {
        let data = [];

        response.forEach((m) => {
            let attachments = m.attachments.map((m) => m);

            if (m.content != '') {
                data.push(
                    `[${new Date(Number(m.createdTimestamp)).toLocaleDateString('en-GB')} - ${new Date(
                        Number(m.createdTimestamp)
                    ).toLocaleTimeString('en-GB')}]  ${m.author.username}(${m.author.id}) → ${m.content}${attachments != '' ? `\n${attachments[0].url}` : ''
                    }`
                );

                data.push(
                    '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────'
                );
            } else if (m.embeds != '') {
                data.push(
                    `[${new Date(Number(m.createdTimestamp)).toLocaleDateString('en-GB')} - ${new Date(
                        Number(m.createdTimestamp)
                    ).toLocaleTimeString('en-GB')}]  ${m.author.username}(BOT) → ${m.embeds[0].title !== null
                        ? m.embeds[0].title + '\n' + m.embeds[0].description
                        : m.embeds[0].description
                    } ${attachments != '' ? `\n${attachments[0].url}` : ''}`
                );
                data.push(
                    '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────'
                );
            }
        });

        data = data.reverse().join('\n');

        fs.writeFileSync('./handle/ticket/ticketSaved.txt', data);

        await client.channels.cache.get('757708996638408776').send({
            files: [
                {
                    attachment: `./handle/ticket/ticketSaved.txt`,
                    name: `ticketSaved.txt`,
                },
            ],
        });
        client.channels.cache.get('757708996638408776').send({ embeds: [TicketLog(interaction.user, 'Salvo', interaction.channel)] });
    });
};
