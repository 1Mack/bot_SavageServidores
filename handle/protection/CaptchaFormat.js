const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')


exports.CaptchaFormat = function (user, etapa) {
    const emojis = ['😎', '👽', '🤡', '🎃', '🐶', '🤖', '😻', '🦄', '😡', '🤯']

    const randomNumber = Math.floor(Math.random() * emojis.length)

    const embed = new MessageEmbed()
        .setColor('36393f')
        .setTitle(`Bem Vindo a Savage Servidores ${user.username}`)
        .setDescription(`***___LEIA COM ATENÇÃO!!___***

    **Etapa ${etapa}/3**
    
    Para poder ver as salas do discord, você deverá fazer o captcha abaixo!
    
    **Clique no botão que possui o emoji: ${emojis[randomNumber]}**`)
        .setTimestamp()
        .setFooter({ text: 'Sistema de Captcha Exclusivo da Savage Servidores' })
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    const row1 = new MessageActionRow()
    const row2 = new MessageActionRow()

    emojis.map((m, i) => {

        if (i < 5) {
            row1.addComponents(
                new MessageButton()
                    .setCustomId(emojis[randomNumber] == m ? `rightCaptcha_${i}` : `wrongCaptcha_${i}`)
                    .setEmoji(m.toString())
                    .setStyle('SUCCESS')
            )
        } else {
            row2.addComponents(
                new MessageButton()
                    .setCustomId(emojis[randomNumber] == m ? `rightCaptcha_${i}` : `wrongCaptcha_${i}`)
                    .setEmoji(m.toString())
                    .setStyle('SUCCESS')
            )
        }
    })


    return { embed, row1, row2, emoji: emojis[randomNumber] }

}

