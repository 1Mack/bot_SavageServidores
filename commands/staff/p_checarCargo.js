const { connection2 } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'checar_cargo',
  description: 'Checar validade do cargo',
  options: [],
  default_permission: false,
  async execute(client, interaction) {
    await interaction.reply('Checando Cargos')

    const con2 = connection2.promise()

    let [result] = await con2.query(`select playerid, flags, discordID from Cargos`)

    let guildStaff = interaction.guild.members.cache.filter(m => m._roles.includes('722814929056563260'))

    const finalresult = await guildStaff.filter(m => result.every(f => f.discordID != m.id))
    let normalStaffs = []
    await finalresult.forEach(async element => {
      if (element._roles.find(m => serversInfos.map(a => a.tagComprado).includes(m))) {
        let fetchedUser = await interaction.guild.members.cache.get(element.user.id);

        if (!fetchedUser) return interaction.channel.send(`${element} -> NAO ACHEI`)

        await fetchedUser.roles.remove(serversInfos.map(a => a.tagComprado).concat('722814929056563260'))
        await fetchedUser.setNickname(fetchedUser.user.username).catch(() => { });
        const embedVipExpirado = new EmbedBuilder()
          .setColor('#0066FF')
          .setTitle(`Olá ${fetchedUser.user.username}`)
          .setDescription(
            `> O tempo do seu cargo comprado acabou 😿
> Mas não fique triste, tenho uma ótima notícia para você!
> Estou te dando um **código promocional de 15% de desconto** para renovação do seu plano 😍`
          )
          .addFields(
            { name: '\u200B', value: '\u200B' },
            {
              name: 'Como faço para resgatar?',
              value: `Basta ir no canal: <#855200110685585419> e abrir um ticket solicitando o seu cupom!!`,
              inline: false,
            },
          )
          .setImage('https://cdn.discordapp.com/attachments/751428595536363610/837855972663754792/savage-servidores3.gif');
        await fetchedUser.send({ embeds: [embedVipExpirado] }).catch(() => console.log('nao enviei para o ' + fetchedUser.user.username))
        interaction.channel.send(`${element}`)

      } else {
        normalStaffs.push(element)
      }

    });
    if (normalStaffs.length > 0) {
      interaction.channel.send(`${normalStaffs.map(m => m)}`)
    }
    interaction.followUp('FEITO').then(() => interaction.deleteReply())
  }
}