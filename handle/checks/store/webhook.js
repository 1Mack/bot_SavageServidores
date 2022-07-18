const { WebhookClient, EmbedBuilder } = require('discord.js');
const { webhookSavageStore } = require('../../../configs/config_webhook');
const { currentDateFormatted } = require('./utils');


const client = new WebhookClient({ id: webhookSavageStore.id, token: webhookSavageStore.token });

function broadcast(text, fields, error = false) {
  const embed = new EmbedBuilder()
  if (text) {
    embed.setDescription(text)
  } else {
    embed.addFields(fields);
  }
  if (error) embed.setColor('DARK_RED')
  else embed.setColor('#32a83e')
  embed.setFooter({ text: currentDateFormatted().toString() });
  client.send({ embeds: [embed] });
}

exports.debug = function (text, fields, error = false, ignoreable = false) {
  if (client && !ignoreable) broadcast(text, fields, error);
  else if (error) console.log(text)
}