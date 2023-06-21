const { ComponentType } = require("discord.js");
const { TelandoButtons } = require("./buttons");
const { Telando_handle_ban } = require("./telando_handle_ban");

exports.Telando_handle_cancel = async function (interaction) {

  const findChannel = interaction.guild.channels.cache.get(interaction.channelId)
  const [, , teladorDiscord] = findChannel.name.split('→')
  const telandoButtons = TelandoButtons()

  if (interaction.user.id !== teladorDiscord) return;


  interaction.reply('<:blank:773345106525683753>')
  interaction.deleteReply()
  await interaction.message.edit(
    {
      content: `Tem certeza que quer excluir a sala?`,
      components: [telandoButtons.sendToTelados]
    }
  )
  const filter = i => {

    return i.user.id === interaction.user.id;
  };

  interaction = await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 }).catch(() => { })

  if (!interaction || interaction.customId === 'cancel') {

    interaction.message.delete()

    return interaction.reply({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })

  } else if (interaction.customId === 'send_telados') {

    Telando_handle_ban(interaction, true)
  } else {
    interaction.message.delete()

    interaction.reply({ content: 'Deseja prosseguir com essa ação?', components: [telandoButtons.confirm] })

    const filter2 = i => {
      i.deferUpdate();
      return i.user.id == interaction.user.id && i.channelId == interaction.channelId;
    };

    let { customId } = await interaction.channel
      .awaitMessageComponent({ filter: filter2, time: 100000, errors: ['time'] }).catch(() => {
        interaction.deleteReply()

        interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })
        return interaction.channel.send('Você não respondeu a tempo...voltando ao painel inicial!').then(() => setTimeout((m) => {
          m.delete()
        }, 5000))
      })
    interaction.deleteReply()

    if (customId === 'nao') {
      return interaction.channel.send({ content: '<:blank:773345106525683753>', components: [telandoButtons.banOrCancel] })
    } else {
      return interaction.channel.delete()
    }
  }

}