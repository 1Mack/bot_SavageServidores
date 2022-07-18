const { ApplicationCommandOptionType } = require('discord.js')

const { guildsInfo } = require('../../configs/config_geral');
const { WrongUsageOfCommand, newEmbed, UserSendEmbed } = require('./embed');
module.exports = {
  name: 'rsugestao',
  description: 'Responder as Sugestões',
  options: [
    { name: 'msgid', type: ApplicationCommandOptionType.String, description: 'Id da msg da sugestão', required: true, choices: null },
    { name: 'validation', type: ApplicationCommandOptionType.String, description: 'Escolher um Servidor para o Set', required: true, choices: [{ name: 'aprovado', value: 'true' }, { name: 'reprovado', value: 'false' }] },
    { name: 'reason', type: ApplicationCommandOptionType.String, description: 'Motivo da resposta', required: true, choices: null },
  ],
  default_permission: false,
  cooldown: 0,
  async execute(client, interaction) {
    let msgId = interaction.options.getString('msgid'),
      validation = interaction.options.getString('validation').toLowerCase(),
      reason = interaction.options.getString('reason').toLowerCase()

    if (validation == 'true') {
      validation = {
        color: '0CD531',
        title: 'Aprovado',
      };
    } else {
      validation = { color: 'CF1616', title: 'Reprovado' };
    }

    try {
      const canal = client.guilds.cache
        .get(guildsInfo.main)
        .channels.cache.find((channel) => channel.id === '778411417291980830');
      canal.messages.fetch(msgId).then(async (m) => {
        if (['Aprovado', 'Reprovado'].includes(m.embeds[0].title)) return interaction.reply({ content: '**Essa msg já foi respondida!!**' }).then(() => setTimeout(() => interaction.deleteReply(), 10000))
        m.edit({ embeds: [newEmbed(validation, m, reason, interaction)] });

        try {
          let fetchUser = await client.users.fetch(m.embeds[0].title.substr(-22, 18));

          fetchUser.send({ embeds: [UserSendEmbed(validation, msgId)] });
        } catch (err) { }
      });
    } catch (error) {
      console.log(error);
      client.channels.cache
        .get('770401787537522738')
        .send({ content: '<@323281577956081665> | **Houve um erro ao editar a msg!**' });
    } finally {
    }
  },
};
