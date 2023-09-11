const { EmbedBuilder } = require('discord.js');
const { currentDateFormatted } = require('./utils');
const { guildsInfo } = require('../../../configs/config_geral');


exports.SendMessage = class {
  constructor(client) {
    this.guild = client.guilds.cache.get(guildsInfo.log)
  }
  error(title, description) {
    const embed = new EmbedBuilder().setColor('#ab0909')
    if (title) embed.setTitle(title)
    if (description) embed.setDescription(description)

    this.guild.channels.cache.get('1124105273494216755').send({ content: '<@323281577956081665>', embeds: [embed] })
  }
  successCompra(sale, errors) {
    const embed = new EmbedBuilder().setColor('#32a83e').setTitle(`${sale.internal_id}`).setFooter({ text: currentDateFormatted().toString() }).setFields([
      { name: 'Nome', value: `${sale.client_name}`, inline: true },
      { name: 'CPF', value: `${sale.client_document}`, inline: true },
      { name: 'Email', value: `${sale.client_email}`, inline: true },
      { name: 'STEAMID', value: `${sale.client_identifier}`, inline: true },
      { name: 'DISCORD', value: `<@${sale.client_discord}>`, inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
      { name: 'Pagamento', value: `${sale.gateway}`, inline: true },
      { name: 'Modo de Pagamento', value: `${sale.payment_method}`, inline: true },
      { name: 'Total', value: `${sale.price}`, inline: true },
    ])
    if (sale.promo_code) {
      embed.addFields([
        { name: 'Cupom', value: `${sale.promo_code}`, inline: true },
        { name: 'Tipo do Cupom', value: `${sale.promo_type}`, inline: true },
        { name: 'Valor do Cupom', value: `${sale.promo_value}`, inline: true }
      ])
    }
    embed.addFields({ name: '\u200B', value: `\u200B`, inline: false })

    sale.packages.map(pkg => {
      let pkgFind = { servidor: pkg.commands.command.servidor, beneficio: pkg.commands.command.beneficio }
      let errorsFind = errors.find(m => m.id == pkg.id)
      embed.addFields([
        { name: 'Plano', value: pkg.name, inline: true },
        { name: 'Descrição', value: '```' + JSON.stringify(pkgFind) + '```', inline: true },
        { name: 'Erros', value: errorsFind ? '```' + JSON.stringify(errorsFind) + '```' : 'null', inline: true }
      ])
    })
    this.guild.channels.cache.get('954374435622760508').send({ embeds: [embed] })
  }
}