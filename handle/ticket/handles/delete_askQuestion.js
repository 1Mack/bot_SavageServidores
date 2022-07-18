exports.Delete_AskQuestion = async function (interaction, channel) {

  const filter = (m) => m.author.id === interaction.user.id && m.channel.id == interaction.channelId;

  interaction.channel.send(`Alguma consideração final para o player? Escreva o(s) ID(s) da(s) mensagem(s) **ou** escreva diretamente o que deseja mandar para ele **ou** se não responder nada dentro de 45s, eu não irei mandar nada pra o player!
    
    **Exemplo 1:** 953253171218767872, 953253136951283753

    **Exemplo 2:** Agradecemos seu reporte, bom jogo!

    `)
  let finalMessage

  await channel
    .awaitMessages({
      filter,
      max: 1,
      time: 45000,
      errors: ['time'],
    })
    .then(async (message) => {
      message = message.first();
      message.delete();

      message = message.content

      if (/([0-9])/.test(message)) {
        message = message.split(', ')

        channel = await channel.messages.fetch()

        channel = await channel.filter(m => message.includes(m.id))


        if (channel.size > 0) {
          message = ''
          await channel.map(m => message += m.content + '\n')
          message = message.trimEnd()
        } else {
          message = null
        }
      } else if (/([0-9])/.test(message) && message.length < 15) {

        message = null
      }
      finalMessage = message
    }).catch(() => finalMessage = null)


  return finalMessage
}