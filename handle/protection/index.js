const { CaptchaFormat } = require('./CaptchaFormat')
const { SuccessCaptcha, WrongCaptcha1, WrongCaptcha2, ChannelCreated, MissingTimeCaptcha } = require('./embed')
const wait = require('util').promisify(setTimeout);

exports.Captcha = async function (interaction, client) {

    let channel = await interaction.guild.channels.cache.find(m => m.name == `captcha→${interaction.user.id}`)

    if (!channel) {
        channel = await interaction.guild.channels.create(`captcha→${interaction.user.id}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '924758535747809290',
        })
    }

    interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true })

    let count = 0, captchaTries = 0, logChannel = await interaction.guild.channels.cache.get('770401787537522738').send({ content: `${interaction.user} iniciou o captcha` })
    await channel.bulkDelete(50)

    let captchFormat = CaptchaFormat(interaction.user, '1')

    let msg = await channel.send({ embeds: [captchFormat.embed], components: [captchFormat.row1, captchFormat.row2] })
    let emojiList = [captchFormat.emoji]

    while (count < 3) {
        if (count > 0 || captchaTries == 1) {
            do {
                captchFormat = CaptchaFormat(interaction.user, count + 1)

            } while (emojiList.find(m => m == captchFormat.emoji))

            msg.edit({ embeds: [captchFormat.embed], components: [captchFormat.row1, captchFormat.row2] })
            emojiList.push(captchFormat.emoji)
        }

        const filter = i => {
            i.deferUpdate();
            return i.user.id == interaction.user.id
        };

        await channel
            .awaitMessageComponent({ filter, time: 30000, errors: ['time'] })
            .then(async (m) => {

                if (m.customId.includes('wrongCaptcha')) {
                    if (captchaTries == 0) {
                        msg.edit({ embeds: [WrongCaptcha1(interaction)], components: [] })
                        count = -1
                        captchaTries += 1
                        logChannel.edit({ content: `${logChannel.content}, **errou 1/2**` })
                        await wait(12000)

                    } else {
                        msg.edit({ embeds: [WrongCaptcha2(interaction)], components: [] })
                        captchaTries += 1
                        interaction.member.roles.add('924676943041941505')
                        logChannel.edit({ content: `${logChannel.content}, **errou 2/2**` })
                        await wait(5000)
                        channel.delete()
                    }
                }
            })
            .catch(async () => {

                msg.edit({ embeds: [MissingTimeCaptcha(interaction)], components: [] })
                captchaTries = 2
                logChannel.edit({ content: `${logChannel.content}, **não respondeu a tempo**` })
                await wait(5000)


            });

        if (captchaTries == 2) {
            return channel.delete()
        }

        count++
    }

    msg.edit({ embeds: [SuccessCaptcha(interaction)], components: [] })
    interaction.member.roles.add('924729364032155739')
    logChannel.edit({ content: `${logChannel.content}, **finalizou com sucesso**` })
    await wait(5000)
    channel.delete()

}
