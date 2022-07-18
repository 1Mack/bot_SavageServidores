const Discord = require('discord.js');

exports.WrongChannel = function (interaction) {
  const embed = new Discord.EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, Use o canal <#778411417291980830> para sugerir algo !`
    );
  return embed;
};
exports.SugestaoLog = function (interaction, sugestao) {
  const embed = new Discord.EmbedBuilder()
    .setColor('#cce336')
    .setTitle(`***${interaction.user.username} (ID${interaction.user.id})***`)
    .setDescription(`**${sugestao}**`)
    .setFooter({ text: 'Comando /sugestao' });
  return embed;
};

exports.PerfilInfoGenerating = function (interaction) {
  const embed = new Discord.EmbedBuilder()
    .setColor('#cce336')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, Gerando informações do seu perfil, aguarde <a:savage_loading:837104765338910730>`
    );
  return embed;
};

exports.PerfilWrong = function (interaction) {
  const embed = new Discord.EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, Algo deu errado, confira se você pegou o link certo do seu perfil!!`
    );
  return embed;
};
