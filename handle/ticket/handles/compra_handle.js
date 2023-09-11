const { TicketCompraPlanosOptions, TicketCompraPagamentosOptions, TicketCompraPlanosMenPerOptions, ComponentType } = require('../embed');
const { Payment_calc } = require('./payment_calc');
exports.compra_Handle = async function (m, user, msg) {

  const filter = i => {
    i.deferUpdate();
    return i.user.id === user.id;
  };

  await msg.edit({ embeds: [TicketCompraPlanosOptions(user).embed], components: [TicketCompraPlanosOptions(user).lista] });

  let FirstAwnser = await m.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 45000 })
    .then(async (response) => {

      return response.values[0]
    }).catch(() => { return 'Indefinido' })

  let cargo = FirstAwnser


  if (FirstAwnser !== 'outros') {
    await msg.edit({ embeds: [TicketCompraPlanosMenPerOptions(user, Payment_calc(FirstAwnser, null).plano, FirstAwnser).embed], components: [TicketCompraPlanosMenPerOptions(user, Payment_calc(FirstAwnser, null).plano, FirstAwnser).lista] });
    FirstAwnser = await m.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 45000 })
      .then(async (response) => {

        return response.values[0]
      }).catch(() => { return 'Indefinido' })
  }

  await msg.edit({ embeds: [TicketCompraPagamentosOptions(user).embed], components: [TicketCompraPagamentosOptions(user).lista] });

  const SecondAwnser = await m.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 45000 })
    .then(async (response) => {

      return response.values[0]
    }).catch(() => { return 'Indefinido' })



  const PaymentFunction = Payment_calc(cargo, FirstAwnser, SecondAwnser)
  return `Cargo: **${cargo.toUpperCase()} ${FirstAwnser == 'mensal' || FirstAwnser == 'permanente' ? FirstAwnser.toUpperCase() : ''}**
    > Método de Pagamentos: **${SecondAwnser.toUpperCase()}**
    ${FirstAwnser == 'Indefinido' || FirstAwnser == 'outros' ? '' : `\n> Valor Total: **${PaymentFunction.plano}**${SecondAwnser == 'Indefinido' ? '' : `\n> ${SecondAwnser}: **${PaymentFunction.method}**`}`}\n`
}