const { connection } = require('../../configs/config_privateInfos');
const { WrongChannel, SugestaoLog } = require('./embed');
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'creditos',
  description: 'Ver quantos creditos você possui',
  options: [],
  default_permission: true,
  cooldown: 30,
  async execute(client, interaction) {
    const con = connection.promise();
    let result

    try {
      [result] = (await con.query(`select steamid from du_users where userid = '${interaction.user.id}'`))[0]
    } catch (error) { console.log(error) }

    if (!result) return interaction.reply({
      content: `**Esse comando é so para pessoas verificadas!!**
              [Para verificar-se, clique aqui e siga o tutorial](https://discord.com/channels/${guildsInfo.main}/799419890481758208)`, ephemeral: true
    })

    try {
      [result] = (await con.query(`SELECT credits, authid from store_players where authid regexp '${result.steamid.slice(8)}'`))[0]
    } catch (error) { return interaction.reply({ content: `**Não encontrei as suas informações na loja!!**`, ephemeral: true }) }

    if (!result) return interaction.reply({ content: `**Não encontrei as suas informações na loja!!**`, ephemeral: true })

    interaction.reply(`Você possui ***${result.credits}*** créditos!`)
  },
};
