const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { connection } = require('../../../configs/config_privateInfos');
const { guildsInfo } = require('../../../configs/config_geral')

exports.CoinFlip = async function (client, interaction, lado, creditos) {

  if (creditos < 1000 || creditos > 100000)
    return interaction.reply(
      { content: '**Você só pode apostar valores **maiores que 1000 e menores que 100.000 créditos**', ephemeral: true }
    )

  if (!['710291543608655892', '814295769699713047'].includes(interaction.channelId))
    return interaction.reply(
      { content: '**Você só pode usar esse comando no <#710291543608655892>**', ephemeral: true }
    )

  let alreadyGame
  try {
    alreadyGame = interaction.guild.channels.cache.get(interaction.channelId)
      .messages.cache.find(
        m => m.embeds[0].data.fields[0].value.includes(interaction.user.id) && m.embeds[0].data.footer.text == 'Exclusivo Savage Servidores'
      )
  } catch (error) { }

  if (alreadyGame)
    return interaction.reply(
      { content: `[**Você já possui um jogo em andamento!**](https://discord.com/channels/${guildsInfo.main}/814295769699713047/${alreadyGame.id})`, ephemeral: true }
    )


  const con = connection.promise();
  let result

  try {
    [result] = (await con.query(`select steamid from du_users where userid = '${interaction.user.id}'`))[0]
  } catch (error) { console.log(error) }

  if (!result) return interaction.reply({
    content: `**Esse comando é so para pessoas verificadas!!**
            [Para verificar-se, clique aqui e siga o tutorial](https://discord.com/channels/${guildsInfo.main}/799419890481758208)`, ephemeral: true
  })

  try {
    [result] = (await con.query(`SELECT credits, authid from store_players where authid regexp '${result.steamid.slice(8)}'`))[0]
  } catch (error) { console.log(error) }

  if (!result) return interaction.reply({ content: `**Não encontrei as suas informações na loja!!**`, ephemeral: true })
  if (result.credits < creditos) return interaction.reply({ content: `**Você não tem ___${creditos}___ para apostar, seu saldo atual é de ___${result.credits}___**`, ephemeral: true })

  try {
    await con.query(`UPDATE store_players SET credits = ${result.credits - creditos} where authid = '${result.authid}'`)

  } catch (error) {
    return interaction.reply({ content: `**Houve um erro ao descontar seus creditos!**`, ephemeral: true })
  }
  let winner = Math.random() <= 0.38 ? true : false
  const gifs = {
    CT: 'https://cdn.discordapp.com/attachments/814295769699713047/1118920164373712996/coinflip_CT.gif',
    TR: 'https://cdn.discordapp.com/attachments/814295769699713047/1118920541865246840/coinflip_TR.gif'
  }
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`<a:diamante:650792674248359936> CoinFlip (${lado}) <a:diamante:650792674248359936>`)
    .setImage(winner ? gifs[lado] : lado === 'CT' ? gifs['TR'] : gifs['CT'])
    .addFields(
      { name: 'Jogador', value: `${interaction.user}` },
      { name: 'Total de Créditos possuídos', value: `${result.credits}` },
      {
        name: 'Créditos Apostados',
        value: `${creditos}`,
      },
    )
    .setFooter({ text: 'Exclusivo Savage Servidores' })
  await interaction.reply({ embeds: [embed] })

  setTimeout(() => {
    Query(winner)
  }, 3000);

  async function Query(win) {
    if (win) {
      result.credits += creditos

      await con.query(`UPDATE store_players SET credits = ${result.credits} where authid = '${result.authid}'`).catch((err) => console.log(err))

    }
    finish(win)
  }
  function finish(win) {

    if (!win) {
      embed.data.fields.find(m => m.name == 'Total de Créditos possuídos').value = `${result.credits}`
      embed.setFooter({ text: 'Exclusivo Savage Servidores • finalizado' })
      embed.setColor('#ff0000')
      interaction.editReply({ embeds: [embed] });

    } else {

      embed.data.fields.find(m => m.name == 'Total de Créditos possuídos').value = `${result.credits}`
      embed.setFooter({ text: 'Exclusivo Savage Servidores • finalizado' })
      embed.setColor('#00ff48')
      interaction.editReply({ embeds: [embed] });

    }
    return interaction.guild.channels.cache.get('938247785948512347').send(`${interaction.user} | COINFLIP **${lado}** | Apostou **${creditos} e ${win ? `ganhou ${creditos * 2}` : 'perdeu'}**`)

  }
};
