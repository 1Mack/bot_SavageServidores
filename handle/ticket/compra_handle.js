const {TicketCompraPlanosOptions, TicketCompraPagamentosOptions} = require('../embed')
exports.compra_Handle = async function (m, user) {


   const FirstAwnser = await m.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 45000})
            .then(async (response) => {
                await m.bulkDelete(10);

                await m.send({embeds: [TicketCompraPlanosOptions(interaction.user).embed], components: [TicketCompraPlanosOptions(interaction.user).lista]});
                const filter = i => {
                    i.deferUpdate();
                    return i.user === user;
                };

                return response.values[0]
            }).catch(() => {return 'Indefinido'})

    const SecondAwnser = await m.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 45000})
            .then(async (response) => {
                await m.bulkDelete(10);

                await m.send({embeds: [TicketCompraPagamentosOptions(interaction.user).embed], components: [TicketCompraPagamentosOptions(interaction.user).lista]});

            return response.values[0]
        }).catch(() => {return 'Indefinido'})


    return `Cargo: ${FirstAwnser.toUpperCase()}\n> Método de Pagamentos: ${SecondAwnser.toUpperCase()}`
}