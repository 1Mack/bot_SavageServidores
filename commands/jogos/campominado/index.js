const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { Components } = require('./components');
const { connection } = require('../../../configs/config_privateInfos');
const { guildsInfo } = require('../../../configs/config_geral')



exports.CampoMinado = async function (client, interaction, bombs, creditos) {

  let creditosEarned = 0,
    creditosMultiplier = 0,
    creditosMultiplierInitial = 0

  if (creditos < 1000 || creditos > 100000)
    return interaction.reply(
      { content: '**Você só pode apostar valores **maiores que 1000 e menores que 100.000 créditos**', ephemeral: true }
    )

  if (!['710291543608655892', '814295769699713047'].includes(interaction.channelId))
    return interaction.reply(
      { content: '**Você só pode usar esse comando no <#710291543608655892>**', ephemeral: true }
    )

  try {

    let alreadyGame = interaction.guild.channels.cache.get(interaction.channelId)
      .messages.cache.find(
        m => m.embeds[0].fields[0].value.includes(interaction.user.id) && m.embeds[0].description.includes('Instruções')
      )

    if (alreadyGame)
      return interaction.reply(
        { content: `[**Você já possui um jogo em andamento!**](https://discord.com/channels/${guildsInfo.main}/814295769699713047/${alreadyGame.id})`, ephemeral: true }
      )

  } catch (error) { }



  const con = connection.promise();
  let result

  try {
    [result] = (await con.query(`select steamid from du_users where userid = '${interaction.user.id}'`))[0]
  } catch (error) { console.log(error) }

  if (result == undefined) return interaction.reply({
    content: `**Esse comando é so para pessoas verificadas!!**
            [Para verificar-se, clique aqui e siga o tutorial](https://discord.com/channels/${guildsInfo.main}/799419890481758208)`, ephemeral: true
  })

  result = result.steamid.replace(result.steamid.substring(0, 10), '')
  try {
    [result] = (await con.query(`SELECT credits, authid from store_players where authid like '%${result}'`))[0]
  } catch (error) { console.log(error) }

  if (result == undefined) return interaction.reply({ content: `**Não encontrei as suas informações na loja!!**`, ephemeral: true })
  if (result.credits < creditos) return interaction.reply({ content: `**Você não tem ___${creditos}___ para apostar, seu saldo atual é de ___${result.credits}___**`, ephemeral: true })

  switch (bombs) {
    case 1:
      creditosMultiplier = 0.0005
      creditosMultiplierInitial = 0.00005
      break
    case 3:
      creditosMultiplier = 0.0015
      creditosMultiplierInitial = 0.00015
      break
    case 5:
      creditosMultiplier = 0.0025
      creditosMultiplierInitial = 0.00025
      break
    case 10:
      creditosMultiplier = 0.025
      creditosMultiplierInitial = 0.0025
      break
  }
  let matriz = Array(5)
    .fill(null)
    .map(() => Array(5).fill('<a:warning_savage:856210165338603531>'));
  let bombMatriz = Array(5)
    .fill(null)
    .map(() => Array(5).fill(0));

  let bombsGenerated = GenerateBombs(bombs)

  for (let i in bombsGenerated) {
    bombMatriz[bombsGenerated[i].position1][bombsGenerated[i].position2] = 1
  }

  function BombaChoosed(first, lin, col, customID) {
    if (first) {
      return {
        mainMessage: null,
        exitMessage: ComponentsMessageExit(customID)
      }
    }
    if (bombMatriz[lin][col] == 0) {

      matriz[lin][col] = '<a:diamante:650792674248359936>';

      creditosMultiplier += creditosMultiplierInitial
      creditosEarned += Number((creditosMultiplier * creditos).toFixed(2))

      return {
        mainMessage: Components(matriz),
        exitMessage: ComponentsMessageExit(customID)
      }

    } else {

      matriz[lin][col] = '<a:fogo_savage:779863770843447316>';
      return {
        mainMessage: Components(matriz),
        exitMessage: null
      }

    }



  }

  function ComponentsMessageExit(customID) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ExitMessage${customID}`)
        .setStyle(ButtonStyle.Danger)
        .setLabel(`Clique Aqui para encerrar`)
    )
    return row

  }

  function GenerateBombs(bombs) {

    let Bomb = [];
    for (let i = 0; i < bombs; i++) {
      Bomb[i] = {
        position1: Math.floor(Math.random() * matriz.length),
        position2: Math.floor(Math.random() * matriz.length),
      };

      let BombFilter = () => {
        let BombLength = Bomb.filter(
          (m) => m.position1 == Bomb[i].position1 && m.position2 == Bomb[i].position2

        );
        if (BombLength.length > 1) {
          return true;
        } else {
          return false;
        }
      };

      while (BombFilter()) {
        Bomb[i] = {
          position1: Math.floor(Math.random() * matriz.length),
          position2: Math.floor(Math.random() * matriz.length),
        };
        BombFilter();
      }
    }

    return Bomb;
  }
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`<a:bomb_savage:934927210526162985> Campo Minado (${bombs} ${bombs == 1 ? 'bomba' : 'bombas'}) <a:bomb_savage:934927210526162985>`)
    .setDescription(`
            ***Instruções***
            > <a:anotado_savage:779867798976987147> Para jogar, basta clicar nos botões [<a:warning_savage:856210165338603531>]
            > <a:anotado_savage:779867798976987147> Ao clicar no botão, se ele virar [<a:diamante:650792674248359936>], significa que você acertou,
            > mas se ele virar [<a:fogo_savage:779863770843447316>], significa que você errou e pedeu os creditos.
            > <a:anotado_savage:779867798976987147> Para parar de apostar, basta clicar no botão escrito: **Clique Aqui para encerrar**
            `)
    .addFields(
      { name: 'Jogador', value: `${interaction.user}` },
      { name: 'Total de Créditos possuídos', value: `${result.credits}` },
      {
        name: 'Créditos Apostados',
        value: `${creditos}`,
      },
      { name: 'Créditos ganhados até agora', value: `${creditosEarned}` }
    )
    .setFooter({ text: 'Comando /campominado' })
  await interaction.deferReply()

  let msg = await interaction.followUp({ embeds: [embed], components: Components(matriz) });
  let msgExit = await interaction.channel.send({ content: `<:blank:773345106525683753>` })

  let gameOver = { bool: false, won: false, lin: null, col: null };
  let lastCustomId = null
  while (!gameOver.bool) {


    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id && i.channelId == interaction.channelId;
    };
    await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 100000 })
      .then(async ({ customId }) => {

        if (customId.includes('ExitMessage')) {
          customId = customId.replace('ExitMessage', '').split('')
          return gameOver = {
            bool: true,
            won: true,
            lin: customId[0],
            col: customId[1]
          }
        }
        lastCustomId = customId
        customId = customId.split('');


        await msg.edit({ embeds: [embed], components: BombaChoosed(false, customId[0], customId[1]).mainMessage });

        embed.data.fields.find(m => m.name == 'Créditos ganhados até agora').value = `${creditosEarned}`

        msg.edit({ embeds: [embed] })

        if (creditosEarned > 0 && msgExit.components == '') {
          msgExit.edit({ components: [BombaChoosed(true, null, null, lastCustomId).exitMessage] })

        }

        if (matriz.find(m => m.find(c => c == '<a:fogo_savage:779863770843447316>'))) {

          return gameOver = {
            bool: true,
            won: false,
            lin: customId[0],
            col: customId[1]
          }
        }
      });
  }
  
  async function Query(wonBool) {
      if (wonBool) {
        result.credits += creditosEarned

        await con.query(`UPDATE store_players SET credits = ${result.credits} where authid = '${result.authid}'`).catch((err) => console.log(err))

    } else {
        result.credits -= creditos
        try {
            await con.query(`UPDATE store_players SET credits = ${result.credits} where authid = '${result.authid}'`)

        } catch (error) {
            console.log(error)
        }
    }  
  }

  if (!gameOver.won) {
    await Query(false)

    embed.data.fields.find(m => m.name == 'Créditos ganhados até agora').value = `${creditos}`
    embed.data.fields.find(m => m.name == 'Créditos ganhados até agora').name = `Créditos perdidos`
    embed.data.fields.find(m => m.name == 'Total de Créditos possuídos').value = `${result.credits}`
    embed.setDescription(`
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <:blank:773345106525683753><:blank:773345106525683753><:blank:773345106525683753><:blank:773345106525683753>**JOGO FINALIZADO**
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            <:blank:773345106525683753>
            `)
    embed.setColor('#ff0000')
    msg.edit({ embeds: [embed], components: Components(matriz, bombMatriz, true) });
    try {
      msgExit.delete()

    } catch (error) { }

    interaction.guild.channels.cache.get('938247785948512347').send(`${interaction.user} | Sala com **${bombs} bombas** | Apostou **${creditos} e perdeu**, mas tinha conseguido chegar até **${creditosEarned}**`)

  } else {

    await Query(true)

    embed.data.fields.find(m => m.name == 'Créditos ganhados até agora').value = `${creditosEarned}`
    embed.data.fields.find(m => m.name == 'Créditos ganhados até agora').name = `Créditos ganhados`
    embed.data.fields.find(m => m.name == 'Total de Créditos possuídos').value = `${result.credits}`
    embed.setDescription(`
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <:blank:773345106525683753><:blank:773345106525683753><:blank:773345106525683753><:blank:773345106525683753>**JOGO FINALIZADO**
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            <:blank:773345106525683753>
            `)
    embed.setColor('#00ff48')
    msg.edit({ embeds: [embed], components: Components(matriz, bombMatriz, true) });
    msgExit.delete();

    interaction.guild.channels.cache.get('938247785948512347').send(`${interaction.user} | Sala com **${bombs} bombas** | Apostou **${creditos} e ganhou ${creditosEarned}**`)
  }

};
