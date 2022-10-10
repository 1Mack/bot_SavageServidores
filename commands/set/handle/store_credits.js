const { guildsInfo } = require('../../../configs/config_geral');
const { connection } = require('../../../configs/config_privateInfos');

exports.Store_Credits = async function (client, interaction, steamid, credits) {

  if (interaction.user.id !== '323281577956081665') return interaction.reply({ content: 'Você não pode usar esse comando!', ephemeral: true })

  let row;
  const con = connection.promise();
  try {
    [row] = await con.query(`SELECT id FROM store_players where authid REGEXP '${steamid.slice(8)}'`)

    if (row.length === 0) return interaction.reply({ content: 'Player não encontrado!', ephemeral: true })

    await con.query(`UPDATE store_players set credits = credits + ${credits} where id = '${row[0].id}'`)
  } catch (error) {
    return (
      interaction.reply({ content: 'Houve um erro inesperado!', ephemeral: true }),
      console.log(error)
    )
  }

  interaction.reply({ content: '***Créditos setados!***', ephemeral: true })
  client.guilds.cache.get(guildsInfo.log).channels.cache.get('1009819058885103626').send(`Player **${steamid}** recebeu **${credits}** creditos`)
}