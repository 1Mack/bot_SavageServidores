const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

exports.NotTarget = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, você não pode ter o 1Mack como alvo/não pode setar Fundador, Diretor e Gerente!`
    );
  return embed;
};

exports.logVip = function (fetchUser, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, servidor, extra, interaction) {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(fetchUser.username.toString())
    .addFields(
      { name: 'discord', value: discord1 ? discord1.toString() : 'Indefinido' },
      { name: 'Steamid', value: steamid },
      { name: 'Data da Compra', value: DataInicialUTC.toString() },
      { name: 'Data Final', value: DataFinalUTC == 0 ? '**PERMANENTE**' : DataFinalUTC.toString() },
      { name: 'Cargo', value: cargo },
      { name: 'Servidor', value: servidor },
      { name: 'Observações', value: extra ? extra : 'Indefinido' }
    )
    .setFooter({ text: `Setado Pelo ${interaction.user.username}` });
  return embed;
};

exports.vipSendMSG = function (fetchUser, cargo, tempo, servidor) {
  const embed = new EmbedBuilder()
    .setColor('F0FF00')
    .setTitle(`Olá ${fetchUser.username}`)
    .setDescription(
      `***A sua compra foi concluída com sucesso!***\n\nAgradecemos pela confiança e esperamos que você se divirta com seu novo cargo 🥳`
    )
    .addFields(
      { name: '**Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
      { name: '**Tempo de Duração**', value: `\`\`\`${tempo == 0 ? 'Permanente' : `${tempo} Dias`}\`\`\`` },
      { name: '**Servidor Escolhido**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` }
    );
  return embed;
};


exports.SetSuccess = function (interaction, fetchedUser, cargo) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setDescription(
      `<a:right_savage:856211226300121098> ${interaction.user}, ${fetchedUser ? fetchedUser : ''} foi setado com o cargo **${cargo}** in-game com sucesso !`
    );
  return embed;
};

exports.isDono = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user}, Somente o 1MaaaaaacK pode setar alguém de dono !`
    );
  return embed;
};

exports.staffSendAllMSG = function (fetchUser, cargo, servidor) {
  const embed = new EmbedBuilder()
    .setColor('F0FF00')
    .setTitle('***Novo Staff***')
    .addFields(
      { name: 'Jogador', value: fetchUser.username.toString() },
      { name: 'Cargo', value: cargo.toUpperCase() },
      { name: 'Servidor', value: servidor.toUpperCase() }
    )
    .setThumbnail(fetchUser.avatarURL())
    .setTimestamp();
  return embed;
};

exports.SetAskConfirm = function (interaction) {
  const embed = new EmbedBuilder()
    .setColor('#ffff00')
    .setDescription(
      `<a:warning_savage:856210165338603531> ${interaction.user} Tem certeza que quer fazer isso ?`
    );
  const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('sim')
        .setLabel('SIM')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('nao')
        .setLabel('NÃO')
        .setStyle(ButtonStyle.Primary)
    )
  return { embed, button };
};