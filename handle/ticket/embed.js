const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { serversInfos, guildsInfo } = require('../../configs/config_geral')
const emojis = ['<a:savage_1:839189109943042097>', '<a:savage_2:839189111172628550>', '<a:savage_3:839189110165995570>',
  '<a:savage_4:839189110630776863>', '<a:savage_5:839189110480306186>', '<a:savage_6:839199778172043275>', '<a:savage_7:839199778364457013>',
  '<a:savage_8:839199778516500510>', '<a:savage_9:839199778494480394>', '<a:savage_1:839189109943042097><a:savage_0:839199778415837254>',
  '<a:savage_1:839189109943042097><a:savage_1:839189109943042097>']


exports.HasAlreadyChannel = function (user, canalAwait) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${user}, você já possui uma sala, <#${canalAwait.id}> !`
    );
  return embed;
};

exports.TicketStart = function (user) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle('Savage Servidores - LEIA COM ATENÇÃO')
    .setDescription(
      `Olá ${user},
            
            > Bem vindo ao nosso suporte <a:engrenagem_savage:856206695587250186>
            > 
            > Escolha qual tipo de ticket você quer abrir clicando na lista abaixo`
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setFooter({
      text: 'Sistema de Ticket Exclusivo da Savage Servidores',
      iconURL: 'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
    });
  const row = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
        .setCustomId('TicketFirstOption')
        .setPlaceholder('Nada Selecionado')
        .addOptions([
          {
            label: 'Banimento',
            description: 'Foi banido injustamente? Clique aqui!',
            value: 'banimento',
            emoji: '🚫'
          },
          {
            label: 'Bugs',
            description: 'Está com algum bug? Clique aqui!',
            value: 'bugs',
            emoji: '⚙️'

          },
          {
            label: 'Denúncia',
            description: 'Quer reportar um player? Clique aqui!',
            value: 'denuncia',
            emoji: '⚠️'

          },
          {
            label: 'Dúvida',
            description: 'Está com alguma dúvida? Clique aqui!',
            value: 'duvida',
            emoji: '🆘'

          },
        ])
    )
  return { embed: embed, lista: row };
};

exports.ChannelCreated = function (user, m) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setDescription(`<a:right_savage:856211226300121098> ${user}, sua sala já foi criada
        [CLIQUE AQUI PARA TERMINAR DE ABRIR O TICKET!!!](https://discord.com/channels/${guildsInfo.main}/${m.id})`);
  return embed;
};

exports.TicketServerOptions = function (user) {

  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle('Savage Servidores')
    .setDescription(
      `${user},
            
            > Escolha para qual servidor você deseja que o ticket seja aberto
            `
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setFooter({
      text: 'Sistema de Ticket Exclusivo da Savage Servidores',
      iconURL: 'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
    });
  const row = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
        .setCustomId('TicketSecondOption')
        .setPlaceholder('Nada Selecionado')
        .addOptions(serversInfos.map((m, i) => {
          return {
            label: m.visualName.toString(),
            value: m.name.toString(),
            emoji: emojis[i]
          }
        }))
    )
  return { embed: embed, lista: row };
};

exports.TicketTypeChoosed = function (user, type, servidor) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle(`***Ticket de ${type}***`)
    .setDescription(
      `${user},
            
            **Enquanto a equipe de administração não te responde, nos diga o que você deseja.**

            >  Servidor Escolhido: **${servidor.toUpperCase()}**
            > Para fechar o Ticket, clique no botao <:lock_savage:856224681136226314>
            `
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setFooter({
      text: 'Sistema de Ticket Exclusivo da Savage Servidores',
      iconURL: 'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
    });
  return embed;
};

exports.TicketClosed = function (user) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setTitle(`***Ticket Fechado***`)
    .setDescription(
      `
            > <:unlock_savage:856225547210326046> ➜ Para Reabrir o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            > <:save_savage:856212830969659412> ➜ Para Salvar o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            > <:delete_savage:856222528997556244> ➜ Para Deletar o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            `
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
    .setFooter({ text: `Ticket fechado pelo ${user.username}` });
  return embed;
};

exports.TicketOpened = function (user) {
  const embed = new EmbedBuilder().setColor('36393f').setDescription(`***Ticket aberto pelo ${user}***`);
  return embed;
};

exports.TicketSaved = function (user) {
  const embed = new EmbedBuilder().setColor('36393f').setDescription(`***Ticket salvo pelo ${user}***`);
  return embed;
};

exports.TicketDeleting = function () {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setDescription(`***Deletando Ticket em 5 segundos   <a:savage_loading:837104765338910730>***`);
  return embed;
};

exports.TicketLog = function (user, action, channel) {
  const embed = new EmbedBuilder()
    .setColor('36393f')
    .setAuthor({ name: user.username.toString(), iconURL: user.displayAvatarURL().toString() })
    .addFields(
      { name: 'Discord', value: user.toString() },
      { name: 'Ação', value: action.toString() },
      { name: 'Ticket', value: `${channel.name}` },
      { name: 'Criador do Ticket', value: `<@${(channel.topic)}>` }
    );
  return embed;
};

exports.ticketActionsEmbed = function (status, staff, channel) {

  let id = channel.name.slice(channel.name.lastIndexOf('→') + 1),
    channelType = channel.name.replace(`→${id}`, '')
  const embed = new EmbedBuilder()
    .setColor(status == 'fechado' || status == 'deletado' ? '#ff0000' : '00ff00')
    .setTitle(`***TICKET→${id}***`)
    .setFields(
      { name: 'Status', value: `\`\`\`${status.toUpperCase()}\`\`\`` },
      { name: 'Tipo', value: `\`\`\`${channelType.toUpperCase()}\`\`\`` },
      status == 'fechado' || status == 'deletado' ?
        { name: '\u200B', value: `\`\`\`cs\n"Caso precise de mais alguma coisa, sinta-se à vontade para abrir outro TICKET\n\nSavage Servidores agradece,\nTenha um Bom Jogo!\`\`\`` }
        : { name: '\u200B', value: `**Para acessar seu ticket, clique aqui → ${channel}**` }
    )
    .setFooter({ text: `Ticket ${status} pelo ${staff}` })
  return embed
}
