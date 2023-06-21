const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { connection2 } = require("../../../../configs/config_privateInfos");
const { getSteamid } = require("../../../../handle/checks/getSteamid");

exports.AdminServidorAdicionar = async function (interaction, steamid, discord, tempo, serverID) {
  typeof steamid === 'string' ? steamid = [steamid] : null
  const con = connection2.promise();
  let rows
  if (!tempo) {
    [rows] = await con.query(`SELECT * FROM Servidor_Aluguel WHERE discordID = ${interaction.user.id} AND endDate > DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 3 HOUR)`).catch(() => undefined)

    if (!rows || rows == '') {
      return interaction.reply(!rows ? 'Houve um erro interno, entre em contato com o 1Mack ou tente novamente mais tarde' : 'Não há nenhum servidor ou seu servidor já expirou')
    }
    await interaction.deferReply()
    if (rows.length > 1) {
      const button = new ActionRowBuilder().addComponents(
        rows.map(m => new ButtonBuilder()
          .setCustomId(m.identifier)
          .setLabel(m.name)
          .setStyle(ButtonStyle.Primary))

      )
      interaction.followUp({ content: `Encontrei ${rows.length} servidores em seu cadastro, escolha qual deles você quer mudar a senha`, components: [button] })

      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      };

      await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 })
        .then(async ({ customId }) => {
          rows = rows.find(m => m.identifier == customId)

        }).catch(() => interaction.editReply('Você não respondeu a tempo!'), setTimeout(() => {
          interaction.deleteReply()
        }, 5000))
    } else {
      rows = rows[0]
    }
    steamid = await Promise.all(steamid.map(async m => {
      if (m.includes('http'))
        return await getSteamid(m)
      else
        return m.includes('STEAM') ? m.replace(/[^a-zA-Z_:0-9]/g, '') : { erro: 'Formato Errado', steamURL: m }

    }))

    let findError = await steamid.filter(m => m && m['erro'])

    if (findError.length > 0) {
      interaction.followUp(`Os seguintes dados nao foram adicionados para admin!\n\n${findError.map((m) => `**${m.steamURL}** → ${m.erro}`)}`)
    }
    steamid = steamid.filter(m => m && !m['erro'])
    if (steamid == '') return (interaction.editReply('Você provavelmente forneceu informação errada!\nExemplos Corretos: STEAM_1:1:79461554, https://steamcommunity.com/id/1MaaaaaacK/'),
      setTimeout(() => {
        interaction.deleteReply()
      }, 10000))
    serverID = rows.serverID
    discord = { id: rows.discordID }
    rows.endDate = new Date(rows.endDate).toISOString().replace(/[^:0-9-.]/g, ' ')
  }
  try {
    await con.query(`INSERT IGNORE INTO Cargos
   (playerid, enddate, flags, server_id, discordID) 
  VALUES
  ${steamid.map(m =>
      `('${m}', ${!tempo ? `'${rows.endDate}'` : `(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${tempo} DAY))`}, 'a/z/t', ${serverID}, '${discord.id}')`
    )}`)
  } catch (error) {
    console.log(error)

    if (tempo)
      return false
    else
      return interaction.followUp({ content: `Houve um erro ao atribuir o cargo, entre em contato com o 1MaaaaaacK`, ephemeral: true })
  }

  if (tempo) return true


  return interaction.followUp({ content: `Admins setados com sucesso!` })

}