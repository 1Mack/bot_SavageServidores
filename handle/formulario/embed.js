const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle } = require('discord.js');
const { serversInfos } = require('../../configs/config_geral')

exports.WrongChannel = function (user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${user}, use o canal <#839706805104803860> para fazer o formulário !`
    );
  return embed;
};

exports.HasAlreadyChannel = function (user, canalAwait) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${user}, você já possui uma sala, <#${canalAwait.id}> !`
    );
  return embed;
};

exports.HasAlreadyDoneForm = function (user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${user}, você já fez o formulário, caso não tenha feito, entre em contato com a administração!`
    );
  return embed;
};
exports.FormStart = function (user) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle('Savage Servidores')
    .setDescription(
      `Olá ${user},
            
            > Ficamos felizes em saber que você quer fazer parte da nossa staff 🥳
            > 
            > Antes de iniciarmos o formulário, sabia que você terá 1 minuto para responder a cada pergunta!
            > 
            > Se você falhar, poderá refazer o formuário!
            > 
            > Para começar, clique no emoji **[<a:right_savage:856211226300121098>]** que está localizado abaixo dessa mensagem
            \n<:blank:773345106525683753>`
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setFooter({
      text: 'Sistema de Formuário Exclusivo da Savage Servidores',
      iconURL: 'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
    });
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('formStart')
        .setLabel('Iniciar')
        .setEmoji('<a:right_savage:856211226300121098>')
        .setStyle(ButtonStyle.Danger)
    )
  return { embed: embed, button: row };
};

exports.Reproved = function (user, acertadas, total) {
  const embed = new EmbedBuilder()
    .setColor('#B30B0B')
    .setTitle('Reprovado')
    .setDescription(`Que pena ${user}

      > Você foi reprovado!
      > Você acertou apenas ${acertadas} em um total de ${total}
      > Você poderá fazer o formulário novamente daqui 1 semana`);
  return embed;
};
exports.ChannelCreated = function (user, channel) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setDescription(
      `[<a:right_savage:856211226300121098> ${user.username}, sua sala já foi criada](https://discord.com/channels/343532544559546368/${channel.id})`
    );
  return embed;
};
exports.FormDone = function () {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('*** Formulário Preenchido com sucesso! ***')
    .setDescription(`
      > **Suas respostas foram computadas no meu sistema com sucesso!**
      > 
      > **__O resultado não tem data específica para sair__**
      > 
      > **Você será avisado no seu privado sobre o resultado!**`
    );
  return embed;
};
exports.LogForm = function (user,) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle(`***${user.username}***`)
    .setDescription(
      `
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

**DISCORD_ID:**  ${user.id}
▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
`
    )
    .setFooter({ text: 'Formulário feito' })
    .setTimestamp();
  return embed;
};
exports.FormResultOptions = function (user, result) {
  const embed = new EmbedBuilder()
    .setTitle('Savage Servidores')
    .setColor('36393f')
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setDescription(`__Pergunta Número ${result.id}__

    > ***${result.message_question}***

    Você tem 1 minuto para responder a essa pergunta!`);

  let resultAppear = []
  let emojis = ['<a:savage_1:839189109943042097>', '<a:savage_2:839189111172628550>', '<a:savage_3:839189110165995570>', '<a:savage_4:839189110630776863>']
  let i = 1

  while (true) {

    if (result[`option_${i}`].length < 52) {
      resultAppear.push({
        label: result[`option_${i}`],
        value: String(i) + result.id,
        emoji: emojis[i - 1]
      })
    } else {
      let a = result[`option_${i}`]
      let b
      b = a.split(' ')
      let c = '', d = ''
      b.map((m, index) => {
        if (index <= 5) {
          c += m + ' '
        } else {
          d += m + ' '
        }
      })
      resultAppear.push({
        label: c,
        value: String(i) + result.id,
        emoji: emojis[i - 1]
      })
      resultAppear.push({
        label: d,
        value: String(i) + result.id + 'S',
      })
    }

    if (i == 4) {
      break;
    }
    i++
  }

  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${user.id}`)
        .setPlaceholder('Nada Selecionado')
        .addOptions(resultAppear)


    )

  return { embed: embed, lista: row };
};

exports.FormserverChoose = function (user, resultServerFind) {
  const emojis = ['<a:savage_1:839189109943042097>', '<a:savage_2:839189111172628550>', '<a:savage_3:839189110165995570>',
    '<a:savage_4:839189110630776863>', '<a:savage_5:839189110480306186>', '<a:savage_6:839199778172043275>', '<a:savage_7:839199778364457013>',
    '<a:savage_8:839199778516500510>', '<a:savage_9:839199778494480394>']

  const embed = new EmbedBuilder()
    .setTitle('Savage Servidores')
    .setColor('36393f')
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setDescription(
      `${user},
            
            > Escolha para qual servidor você deseja virar staff


            **Você tem 50 segundos para responder a essa pergunta!**
            `
    )

  if (resultServerFind.length == 0) {
    resultServerFind = serversInfos.filter(server => server.mostActiveServers)
  }
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('formServerChoosed')
        .setPlaceholder('Clique Aqui')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(resultServerFind.map((m, i) => {
          return {
            label: m.visualName.toString(),
            value: m.name.toString(),
            emoji: emojis[i]
          }
        }))
    )
  return { embed: embed, lista: row };
};
exports.ModalFormEmbed = function () {
  const embed = new EmbedBuilder()
    .setColor('#36393f')
    .setTitle('*** Etapa final ***')
    .setDescription(`
      > **Ao abrir o formulário, sempre clique na opção de __confirmar__ para enviar as respostas**
      > 
      > **Caso clique __fora__ do formulário ou clique em __cancelar__, o seu formulário será excluído**
      `
    );
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('start')
        .setLabel(`Começar`)
        .setStyle(ButtonStyle.Danger),
    );

  return { embed, row };
};