const { EmbedBuilder } = require('discord.js');
const { connection2 } = require('../../../../configs/config_privateInfos');
const { serversInfos, serverGroups, guildsInfo } = require('../../../../configs/config_geral');


exports.UpConfirmed = async function (message, client, reactionPerson) {
  let servidor = message.embeds[0].footer.text,
    cargo = Object.keys(serverGroups)[Object.keys(serverGroups).indexOf(message.embeds[0].fields.find(m => m.name.includes('Cargo')).value) - 2],
    discord_id = message.embeds[0].fields.find(m => m.name.includes('DiscordID')).value.replace(/[<@>]/g, ''),
    discordName = message.embeds[0].title,
    steamid = message.embeds[0].fields.find(m => m.name.includes('Steamid')).value,
    upReason = message.embeds[0].fields.find(m => m.name.includes('Motivo')).value,
    suggestedBy = message.embeds[0].fields.find(m => m.name.includes('Sugerido')).value

  if (cargo == undefined) {
    return (message.edit({ content: `Esse staff já esta no cargo mais alto possível ou ele não tem set no servidor ${servidor}`, embeds: [], components: [] }).then(m => setTimeout(() => {
      m.delete()
    }, 5000)))
  } else if (['gerente', 'diretor', 'fundador'].includes(cargo) && reactionPerson.id != '323281577956081665') {
    return (message.channel.send({ content: `${reactionPerson} | O próximo cargo desse staff só pode ser autorizado pelo 1MaaaaaacK` }
    ).then(m => setTimeout(() => {
      m.delete()
    }, 5000)))
  }
  let fetchUser

  const con = connection2.promise();
  const serversInfosFound = serversInfos.find((m) => m.name === servidor);

  try {
    fetchUser = await client.guilds.cache.get(guildsInfo.main).members.cache.get(discord_id);

    if (!fetchUser) {
      await client.guilds.cache.get(guildsInfo.main).members.cache.fetch(discord_id);
    }
  } catch (error) {
    fetchUser = undefined
  }

  if (!fetchUser) return (

    message.edit({ content: `${discordName} não esta no discord **OU** não consegui achá-lo, sugiro você conferir isso!`, components: [], embeds: [] }.then(m => {
      setTimeout(() => {
        m.edit({ content: ' ', embeds: [message.embeds[0]], components: [message.components[0]] })
      }, 6000);
    }))
  )

  let dataInicial = Date.now();
  dataInicial = Math.floor(dataInicial / 1000);


  await con.query(`update Cargos set flags = '${serverGroups[cargo].value}' where playerid regexp '${steamid.slice(8)}'
    and server_id = '${serversInfosFound.serverNumber}'`);

  /*  if (!serverGroups[cargo].value.endsWith('p') && serverGroups[cargo].value != 'vip' && serversInfosFound) {
     await con.query(
       `UPDATE Cargos SET 
                   discordID = '${discord1.id}', 
                   flags = '${serverGroups[cargo].value}'
                   WHERE playerid regexp '${steamid.slice(8)}' AND server_id = '${serversInfosFound.serverNumber}'`
     );
   } else if (opa === undefined || serverGroups[cargo].value.endsWith('p') || serverGroups[cargo].value != 'vip') {
     await con.query(`
                   INSERT IGNORE INTO Cargos (Id, timestamp, playerid, enddate, flags, server_id, discordID) 
                   VALUES (NULL, NULL, '${steamid}', (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3650 DAY)), '${serverGroups[cargo].value}', '${serversInfosFound ? `${serversInfosFound.serverNumber}` : '0'}', '${discord1.id}')
               `
     );
   } */

  const logUp = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(fetchUser.user.username.toString())
    .addFields(
      { name: 'Discord', value: `<@${discord_id}>` },
      { name: 'Steamid', value: steamid.toString() },
      { name: 'Cargo', value: cargo.toString() },
      { name: 'Servidor', value: servidor.toString() },
      { name: 'Motivo do UP', value: upReason.toString() }
    )
    .setTimestamp()
    .setFooter({ text: `Set sugerido pelo ${suggestedBy}` })



  const upSendMSG = new EmbedBuilder()
    .setColor('0099ff')

    .setTitle(`Olá ${fetchUser.user.username}`)
    .setDescription(
      `Devido aos seus esforços, estamos lhe promovendo para um cargo mais alto, ***parabéns*** 🥳🥳
            
            Ah, só não se esqueça, quanto maior o cargo, maior a responsabilidade 😎***`
    )
    .addFields(
      { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
      { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
      { name: '**Novo Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
      { name: '**Motivo**', value: `\`\`\`${upReason}\`\`\`` }
    )
    .setFooter({ text: `Set sugerido pelo ${suggestedBy}` });

  fetchUser.send({ embeds: [upSendMSG] }).catch(() => { })


  const upSendMsgAll = new EmbedBuilder()
    .setColor('F0FF00')
    .setTitle('***Staff Upado***')
    .addFields(
      { name: 'Jogador', value: fetchUser.user.toString() },
      { name: 'Cargo', value: cargo.toUpperCase() },
      { name: 'Servidor', value: servidor.toUpperCase() }
    )
    .setFooter({ text: `Upado pelo ${suggestedBy}` })
    .setThumbnail(fetchUser.avatarURL())
    .setTimestamp();

  message.edit({ content: `**${discordName}** foi upado com sucesso`, embeds: [], components: [] }).then(m => {
    setTimeout(() => {
      m.delete()
    }, 5000);
  })

  client.guilds.cache.get(guildsInfo.main).channels.cache.find((channel) => channel.id == '710288627103563837').send({ embeds: [upSendMsgAll] }).catch(() => { })

  client.guilds.cache.get(guildsInfo.log).channels.cache.find((channel) => channel.id == '934146416400564345').send({ embeds: [logUp] }).catch(() => { })




}