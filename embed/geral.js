const { EmbedBuilder } = require('discord.js');

exports.PlayerDiscordNotFound = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, Não achei o discord desse player !`);
  return embed;
};

exports.InternalServerError = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, Houve um erro interno, contate o 1mack !`
    );
  return embed;
};

exports.GerenteError = function (user) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${user}, você não pode ter esse servidor como alvo, pois não é o gerente dele !`
    );
  return embed;
};

exports.RenameError = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, não consegui renomear o player, faça isso manualmente !`
    );
  return embed;
};

exports.MissinPermissions = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, você não tem permissão para usar esse comando !`
    );
  return embed;
};

exports.AwaitCooldown = function (interaction, timeLeft, command) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user
      }, você só poderá usar o comando ***${command.name.toUpperCase()}*** daqui **${timeLeft.toFixed(
        1
      )} segundos** !`
    );
  return embed;
};
