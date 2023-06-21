const { connection } = require('../../../configs/config_privateInfos');
const { UnCommsLog, PlayerNotFound } = require('./embed');
const { InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');
const { Desmutar_handle } = require('./desmutarHandle/desmutar_handle');

exports.Desmutar = async function (client, interaction, steamid, motivo, tipo) {

  if (steamid['erro']) return interaction.reply({ content: steamid.erro, ephemeral: true })

  const findMSG = await client.guilds.cache.get('792575394271592458').channels.cache.get('1057353383335444532').messages.fetch().then(msgs =>
    msgs.find(msg => msg.embeds[0].data.fields.find(f => f.name.includes('Steamid')).value == steamid)
  )

  if (findMSG) return interaction.reply({ content: 'Esse jogador já está na log aguardando ser averiguado!!' }).then(() => setTimeout(() => interaction.deleteReply(), 8000));


  const con = connection.promise();
  let rows
  try {

    [rows] = await con.query(
      `SELECT bid, authid FROM sb_comms WHERE authid REGEXP "${steamid.slice(8)}" AND RemovedOn IS NULL AND type=${tipo} ORDER BY bid DESC`
    );

    if (rows == '') {
      return interaction.reply({ embeds: [PlayerNotFound(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
    }
  } catch (error) {
    interaction.reply({ embeds: [InternalServerError(interaction)] }).then(() => setTimeout(() => interaction.deleteReply(), 8000));
    return console.error(chalk.redBright('Erro no Unmute'), error);
  }

  const unmuteLog = UnCommsLog(steamid, motivo, interaction, tipo, rows[0].bid)

  if (interaction.member.roles.cache.has('780582159731130378') || interaction.member.roles.cache.has('603318536798077030')) {

    let msg = await client.guilds.cache.get('792575394271592458').channels.cache.get('1057353383335444532').send({ embeds: [unmuteLog.embed] });

    return Desmutar_handle(client, interaction, msg, steamid, motivo, tipo, rows[0].bid)

  } else {

    await client.guilds.cache.get('792575394271592458').channels.cache.get('1057353383335444532').send({ embeds: [unmuteLog.embed], components: [unmuteLog.button] });
    return interaction.reply({ content: 'Unmute enviado para análise!', ephemeral: true }).then(() => setTimeout(() => {
      interaction.webhook.deleteMessage('@original')
    }, 5000))
  }
};
