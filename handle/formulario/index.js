const { FormFirstStep } = require('./formFirstStep');
const { formSecondStep } = require('./formSecondStep')
const { connection } = require('../../configs/config_privateInfos');
const { ChannelType, PermissionFlagsBits } = require('discord.js')
const { HasAlreadyChannel, FormStart, ChannelCreated } = require('./embed');
exports.FormCreate = async function (interaction, client) {
  const canalFind = () => interaction.guild.channels.cache.find((m) => m.name.includes(`form→${interaction.user.id}`))
  const con = connection.promise();

  let [result] = await con.query(`select discord_id from form_awnsers_firstStep where discord_id = '${interaction.user.id}'`);


  if (canalFind())
    return interaction.reply({ embeds: [HasAlreadyChannel(interaction.user, canalFind())], ephemeral: true }).then(() => setTimeout(() => {
      interaction.webhook.deleteMessage('@original')
    }, 5000))


  await interaction.guild.channels
    .create({
      name: `form→${interaction.user.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
      parent: '936310042225934408',
    })
    .then(async (channel) => {

      if (result != '') {

        formSecondStep(interaction.user, channel, client, await channel.send(`${interaction.user}`))

        return interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true }).then(() => setTimeout(() => {
          interaction.webhook.deleteMessage('@original')
        }, 5000))

      }
      let formStartMessage = FormStart(interaction.user)

      let msg = await channel.send({ content: `${interaction.user}`, embeds: [formStartMessage.embed], components: [formStartMessage.button] });


      interaction.reply({ embeds: [ChannelCreated(interaction.user, channel)], ephemeral: true }).then(() => setTimeout(() => {
        interaction.webhook.deleteMessage('@original')
      }, 5000))

      const filter = i => {
        return i.user.id == interaction.user.id && i.channelId == channel.id;
      };

      await channel
        .awaitMessageComponent({ filter, time: 45000, errors: ['time'] })
        .then((i) => {
          i.reply('a').then(() => i.deleteReply())
          FormFirstStep(interaction.user, channel, msg, client);
        })
        .catch(() => {
          return channel.delete();
        });
    });
};
