const { connection } = require('../../configs/config_privateInfos');
const { ApplicationCommandOptionType } = require('discord.js')

const { serversInfos } = require('../../configs/config_geral');
const { minhasHorasEmbed } = require('./embed');
module.exports = {
  name: 'minhashoras',
  description: 'Ver as horas in-game dos staffs',
  options: [],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {


    const con = connection.promise();
    let serversFormatDisplay = []
    for (let i in serversInfos) {
      let result

      try {
        [result] = await con.query(`select * from mostactive_${serversInfos[i].name} WHERE steamid = (select steamid from du_users WHERE userid = '${interaction.user.id}')`);
      } catch (error) { }
      if (result == undefined || result == '') continue;


      function HourFormat(duration) {
        let hrs = ~~(duration / 3600);
        let mins = ~~((duration % 3600) / 60);

        if (mins == 0) {
          return `${hrs} horas`
        } else if (hrs == 0) {
          return `${mins} minutos`
        } else {
          return `${hrs} horas e ${mins} minutos`
        }
      }
      serversFormatDisplay.push(`
                 ***${serversInfos[i].visualName}***
                 
                 **Horas Totais:** ${HourFormat(result[0].total)}
                 **Horas Spec:** ${HourFormat(result[0].timeSPE)}
                 **Horas TR:** ${HourFormat(result[0].timeTT)}
                 **Horas CT:** ${HourFormat(result[0].timeCT)}
                 **Última conexao:** ${new Date(result[0].last_accountuse * 1000).toLocaleDateString('en-GB')}
                 ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃
                 `)
    }

    if (serversFormatDisplay.length > 0) {
      interaction.reply({ embeds: [minhasHorasEmbed(serversFormatDisplay, interaction.user.username)] })
    } else {
      interaction.reply({ content: 'Nenhuma hora encontrada!!', ephemeral: true })
    }
  },
};
