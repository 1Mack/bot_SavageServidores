const { EmbedBuilder } = require('discord.js');
const { connection2, connection } = require('../../../configs/config_privateInfos');
const { serversInfos, guildsInfo } = require('../../../configs/config_geral');


exports.HorasDemotarConfirm = async function (user, message, client) {
  message = message.embeds[0]
  const infos = {
    servidor: message.footer.text,
    discordID: message.fields.find(f => f.name.includes('DiscordID')).value,
    steamid: message.fields.find(f => f.name.includes('Steamid')).value,
    cargo: message.fields.find(f => f.name.includes('Cargo')).value,
    name: message.title
  }

  let fetchUser

  const con2 = connection2.promise();
  const con = connection.promise();
  const serversInfosFound = serversInfos.find((m) => m.name === infos.servidor);

  try {
    fetchUser = await client.guilds.cache.get(guildsInfo.main).members.cache.get(infos.discordID.replace(/[<@>]/g, ''));

    if (!fetchUser) {
      await client.guilds.cache.get(guildsInfo.main).members.cache.fetch(infos.discordID.replace(/[<@>]/g, ''));
    }
  } catch (error) {
    fetchUser = undefined
  }

  await con2.query(`delete from Cargos where playerid regexp '${infos.steamid.slice(8)}'
    and server_id = '${serversInfosFound.serverNumber}'`);
  await con.query(`delete from mostactive_${infos.servidor} where steamid regexp '${infos.steamid.slice(8)}'`).catch(() => { })

  const logDemoted = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(fetchUser ? fetchUser.user.username.toString() : infos.name.toString())
    .addFields(
      {
        name: 'discord',
        value: fetchUser ? fetchUser.user.toString() : infos.discordID.toString(),
      },
      { name: 'Steamid', value: infos.steamid.toString() },
      { name: 'Cargo', value: infos.cargo.toString() },
      { name: 'Servidor', value: infos.servidor.toUpperCase() },
      { name: 'Observações', value: 'Não cumpriu a meta de 20h' }
    )
    .setFooter({ text: `Demotado pelo ${user.username} no HORASDEMOTAR` });

  if (fetchUser) {
    const demotedSendMSG = new EmbedBuilder()
      .setColor('FF0000')
      .setTitle(`Olá ${fetchUser.user.username}`)
      .setDescription(
        `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
      )
      .addFields(
        { name: '**STEAMID**', value: `\`\`\`${infos.steamid}\`\`\`` },
        { name: '**Servidor**', value: `\`\`\`${infos.servidor.toUpperCase()}\`\`\`` },
        { name: '**Motivo**', value: `\`\`\`Ter menos do que 20 horas\`\`\`` }
      );

    let staffRoles = serversInfos.flatMap(m => [m.tagComprado, m.tagDoCargo])

    staffRoles = fetchUser._roles.filter(m => staffRoles.includes(m))

    if (staffRoles.length > 1) {
      fetchUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]).catch(() => { })
    } else {
      fetchUser.roles.remove([
        serversInfosFound.tagDoCargo,
        '722814929056563260',
        serversInfosFound.tagComprado,
      ]).catch(() => { })

      fetchUser.setNickname(fetchUser.user.username).catch(() => { });
    }


    fetchUser.send({ embeds: [demotedSendMSG] }).catch(() => { })

  }
  if (infos.cargo != 'vip') {
    const DemotedMsgAll = new EmbedBuilder()
      .setColor('ff0000')
      .setTitle('***Staff Demotado***')
      .addFields(
        { name: 'Jogador', value: fetchUser.user.toString() || infos.name.toString() },
        { name: 'Cargo', value: infos.cargo.toString().toUpperCase() },
        { name: 'Servidor', value: infos.servidor.toString().toUpperCase() }
      )
      .setFooter({ text: `Demotado no HORASDEMOTAR` })
      .setTimestamp();
    if (fetchUser) DemotedMsgAll.setThumbnail(fetchUser.avatarURL())

    client.channels.cache.get('710288627103563837').send({ embeds: [DemotedMsgAll] })
  }


  client.guilds.cache.get(guildsInfo.log).channels.cache.find((channel) => channel.id == '792576104681570324').send({ embeds: [logDemoted] });

}