exports.Payment_calc = function (plano, tipo, method) {

    switch (plano) {
        case 'vip':
            plano = 10
            break;
        case 'trial':
            plano = 15
            break;

        case 'mod':
            plano = 25
            break;

        case 'modplus':
            plano = 30
            break;

        case 'adm':
            plano = 40
            break;

        case 'admplus':
            plano = 50
            break;
        default:
            break;
    }

    if (tipo) {
        if (tipo == 'permanente') {
            plano *= 5
        }
    }

    switch (method) {
        case 'Boleto':
            plano += 3.5
            break;

        case 'Paypal':
            plano += plano * 0.15
            method = 'savageservidores@outlook.com'
            break;
        case 'Pix':
            method = 'savageservidores@outlook.com'
            break;
        case 'Mercado Pago':
            method = 'savageservidores@outlook.com'
            break;
        case 'Picpay':
            method = '@savageservidores'
            break;
        case 'GiftCard':
            plano += plano * 0.22
            break;

        case 'Saldo Steam':
            plano += plano * 0.22
            break;

        case 'Skin':
            plano += plano * 0.30
            method = 'https://steamcommunity.com/tradeoffer/new/?partner=158923109&token=tbFOqYDn'

            break;

        case 'Cartao de Credito ou Debito':
            plano += 3.5
            break;

        default:
            break;
    }

    return { plano, method }
}