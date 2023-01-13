const { connection } = require('../../configs/config_privateInfos');
const { HandleError } = require('../../error');
const wait = require('util').promisify(setTimeout);
const { FormResultOptions, Reproved } = require('./embed');
const { formSecondStep } = require('./formSecondStep');

exports.FormFirstStep = async function (user, channel, msg, client) {
  let questions, questionsResults = 0
  const con = connection.promise();

  [questions] = await con.query(`SELECT * FROM form_messages_firstStep`)


  for (let question of questions) {
    let formResultOptionsFunction = FormResultOptions(user, question)

    try {
      await msg.edit({ content: ' ', embeds: [formResultOptionsFunction.embed], components: [formResultOptionsFunction.lista] });

    } catch (error) {

      msg = await channel.send({ content: ' ', embeds: [formResultOptionsFunction.embed], components: [formResultOptionsFunction.lista] })
    }

    const filter = i => {
      i.deferUpdate();
      return i.user.id == user.id && i.channelId == channel.id;
    };

    try {
      let { values } = await channel.awaitMessageComponent({ filter, time: 100000, errors: ['time'] })

      if (String(question.message_right_option) == values[0].charAt(0)) {
        questionsResults++
      }

    } catch (error) {
      await msg.edit({ content: `${user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: [] })
        .catch(() => channel.send(`${user} **| Você não respondeu a tempo....Deletando Canal**`))
      await wait(8000)
      return channel.delete()
    }


  }

  if (questionsResults === 7) {

    try {
      await con.query(
        `INSERT INTO form_awnsers_firstStep (discord_id) VALUES (?)`,
        [`${user.id}`]
      );
    } catch (error) {

      await msg.edit({
        content:
          `${user} **| Não consegui registrar sua resposta, deletando canal!!!\`**`,
        embeds: [], components: []
      })
      await wait(5000)
      await channel.delete()
      return HandleError(client, error)

    }
    formSecondStep(user, channel, client, msg)

  } else {
    msg.edit({ embeds: [Reproved(user, questionsResults, '7')] })
    await wait(15000)
    return channel.delete();
  }

}

