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

  const interactionHandle = await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 }).catch(() => { })

  if (!interactionHandle || interactionHandle.customId === 'cancel') {

    interaction.message.delete()

    return interactionHandle ? interactionHandle.reply({ components: [telandoButtons.banOrCancel] }) : interactionHandle.channel.send({ components: [telandoButtons.banOrCancel] })

  } else if (interactionHandle.customId === 'send_telados') {

    Telando_handle_ban(interactionHandle, true)
  } else {
    interactionHandle.message.delete()

    interactionHandle.reply({ content: 'Deseja prosseguir com essa ação?', components: [telandoButtons.confirm] })

    const filter2 = i => {
      i.deferUpdate();
      return i.user.id == interactionHandle.user.id && i.channelId == interactionHandle.channelId;
    };

    let { customId } = await interactionHandle.channel
      .awaitMessageComponent({ filter: filter2, time: 100000, errors: ['time'] }).catch(() => {
        interactionHandle.deleteReply()

        interactionHandle.channel.send({ components: [telandoButtons.banOrCancel] })
        return interactionHandle.channel.send('Você não respondeu a tempo...voltando ao painel inicial!').then(() => setTimeout((m) => {
          m.delete()
        }, 5000))
      })
    interactionHandle.deleteReply()

    if (customId === 'nao') {
      return interactionHandle.channel.send({ components: [telandoButtons.banOrCancel] })
    } else {
      return interactionHandle.channel.delete()
    }
  }

}