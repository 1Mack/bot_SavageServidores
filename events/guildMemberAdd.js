const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { guildsInfo } = require('../configs/config_geral');
module.exports = {
  name: 'guildMemberAdd',
  once: 'on',
  async execute(member, client) {
    await member.fetch()

    const embedLog = new EmbedBuilder()
      .setColor('#00F180')
      .setAuthor({ name: member.user.username.toString(), iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setTitle('***Novo Membro***')
      .addFields(
        { name: 'Discord', value: member.user.toString(), inline: true },
        {
          name: 'Conta criada dia',
          value: new Date(Number(member.user.createdTimestamp)).toLocaleDateString('en-GB').toString(),
          inline: true,
        },
        { name: 'Membro Número', value: member.guild.memberCount.toString() }
      )
      .setFooter({ text: `ID: ${member.user.id}` })
      .setTimestamp();

    client.channels.cache.get('716023078374867036').send({ embeds: [embedLog] });

    if (member._roles.find(m => m != '808436147054706688')) {
      embedLog.addFields({ name: 'Cargos', value: member._roles.map(m => `<@&${m}>`).toString() })
      client.channels.cache.get('888609571894087770').send({ content: '<@323281577956081665>', embeds: [embedLog] });

    }

    const embedPrivateMSG = new EmbedBuilder()
      .setColor('36393f')
      .setTitle(`Bem-vindo a Savage Servidores, \n${member.user.username}`)
      .setURL(`https://discord.com/channels/${guildsInfo.main}/808452907245895722/925127417536856084`)
      .setThumbnail(member.user.avatarURL())
      .setDescription(`**Para ter acesso ao nosso discord, você deve, primeiramente, fazer o nosso [CAPTCHA](https://discord.com/channels/${guildsInfo.main}/808452907245895722/925127417536856084)**\n\n**Após isso, você terá acesso a todos os nossos canais**`)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Link do Discord', value: 'https://discord.savageservidores.com' },
        { name: 'Link do Grupo da Steam', value: 'https://steam.savageservidores.com' },
        { name: 'Link da Loja', value: 'https://loja.savageservidores.com' }


      )
      .setImage('https://cdn.discordapp.com/attachments/814295769699713047/960953722308022282/bem-vindos.gif')

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('CAPTCHA')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/channels/${guildsInfo.main}/808452907245895722/925127417536856084`),
      new ButtonBuilder()
        .setLabel('LOJA')
        .setStyle(ButtonStyle.Link)
        .setURL('https://loja.savageservidores.com'),
      new ButtonBuilder()
        .setLabel('STEAM')
        .setStyle(ButtonStyle.Link)
        .setURL('https://steam.savageservidores.com'),
    )
    member.send({ embeds: [embedPrivateMSG], components: [button] }).catch(() => { })
    try {
      member.roles.add('924729364032155739')
    } catch (err) {
      try {
        (await member.guild.members.fetch(member.id)).roles.add('924729364032155739')

      } catch (error) {

      }
    }
  },
};
