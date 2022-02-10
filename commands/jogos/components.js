const { MessageActionRow, MessageButton } = require('discord.js');

exports.Components = function (matriz, bombMatriz, bool) {
  let row = [new MessageActionRow(), new MessageActionRow(), new MessageActionRow(), new MessageActionRow(), new MessageActionRow()]

  for (let i = 0; i < 5; i++) {
    for (let x = 0; x < 5; x++) {
      if (matriz[i][x] == '<a:diamante:650792674248359936>') {
        row[i].addComponents(
          new MessageButton()
            .setCustomId(`${i}${x}`)
            .setDisabled(true)
            .setEmoji('<a:diamante:650792674248359936>')
            .setStyle('SUCCESS')
        )
      } else if (matriz[i][x] == '<a:fogo_savage:779863770843447316>') {
        row[i].addComponents(
          new MessageButton()
            .setCustomId(`${i}${x}`)
            .setDisabled(true)
            .setEmoji('<a:fogo_savage:779863770843447316>')
            .setStyle('DANGER')
        )
      } else {
        if (bool) {
          row[i].addComponents(
            new MessageButton()
              .setCustomId(`${i}${x}`)
              .setEmoji('<a:warning_savage:856210165338603531>')
              .setStyle('PRIMARY')
              .setDisabled(true)
          )
        } else {
          row[i].addComponents(
            new MessageButton()
              .setCustomId(`${i}${x}`)
              .setEmoji('<a:warning_savage:856210165338603531>')
              .setStyle('PRIMARY')
          )
        }
      }
    }
  }

  if (matriz.find(m => m.find(c => c == '<a:fogo_savage:779863770843447316>'))) {

    for (let i = 0; i < 5; i++) {
      for (let x = 0; x < 5; x++) {

        row[i].components[x].setDisabled(true)
      }
    }
  }

  if (bombMatriz) {
    for (let i = 0; i < 5; i++) {
      for (let x = 0; x < 5; x++) {
        if (bombMatriz[i][x] == 1)
          row[i].components[x].setEmoji('<a:fogo_savage:779863770843447316>').setDisabled(true)

      }
    }
  }

  return row;

}
