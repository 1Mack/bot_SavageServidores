const { guildsInfo } = require('../../../configs/config_geral');
const { connection } = require('../../../configs/config_privateInfos');

exports.Store_Skins = async function (client, interaction, steamid, skin) {

  if (interaction.user.id !== '323281577956081665') return interaction.reply({ content: 'Você não pode usar esse comando!', ephemeral: true })

  let row, row2;
  const con = connection.promise();
  try {
    [row] = await con.query(`SELECT id FROM store_players where authid REGEXP '${steamid.slice(8)}'`)

    if (row.length === 0) return interaction.reply({ content: 'Player não encontrado!', ephemeral: true })

  } catch (error) {
    return (
      interaction.reply({ content: 'Houve um erro inesperado!', ephemeral: true }),
      console.log(error)
    )
  }

  try {
    [row2] = await con.query(`SELECT unique_id FROM store_items where player_id = '${row[0].id}' AND unique_id = '${skin}'`)

    if (row2.length > 0) return interaction.reply({ content: 'Esse player já possui essa skin!', ephemeral: true })

    let dateNow = Date.now().toString().slice(0, -3)

    await con.query(`INSERT INTO store_items (player_id, type, unique_id, date_of_purchase, date_of_expiration, price_of_purchase) VALUES ('${row[0].id}', 'playerskin', '${skin}', ${dateNow}, '0', '0')`)

  } catch (error) {
    return (
      interaction.reply({ content: 'Houve um erro inesperado!', ephemeral: true }),
      console.log(error)
    )
  }

  interaction.reply({ content: '***Skin setada!***', ephemeral: true })
  client.guilds.cache.get(guildsInfo.log).channels.cache.get('1009819058885103626').send(`Player **${steamid}** recebeu a skin **${skin}**`)
}