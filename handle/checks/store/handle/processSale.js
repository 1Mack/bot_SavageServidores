const { Email } = require("../../../email");
const { GetSteamid } = require("../../getSteamid");
const { SendMessage } = require("../webhook");
const { CommandExecute } = require("./commandExecute");

exports.ProcessSale = async function (sale, client) {
  const commandExecute = new CommandExecute(client)
  //VER ISSO AINDA
  if (await commandExecute.isSetted()) return;

  await new Email(sale).orderReceived().catch(() => { })

  const sendMessage = new SendMessage(client)

  let steamidHandle = await GetSteamid(sale.client_identifier)

  if (steamidHandle['error']) {
    sendMessage.error('STEAMID errada', `***ID*** \`${sale.internal_id}\`\n***STEAMID:*** \`${sale.client_identifier}\`\n***ERRO:*** \`${steamidHandle.erro}\``)
    return;
  }
  sale.client_identifier = steamidHandle


  let execution = {}, errors = []


  await sale.packages.map(async package => {

    if (['VIP', 'TRIAL', 'MOD', 'ADM', 'GERENTE'].some(v => package.commands.command.plano.includes(v))) {

      execution = await commandExecute.setVip(sale.client_identifier, sale.client_discord, package)

    } else if (package.commands.command.plano.includes('CREDITO')) {

      execution = await commandExecute.setCredits(sale.client_identifier, package.commands.command)

    } else if (package.commands.command.plano.includes('SKIN')) {

      execution = await commandExecute.setSkins(sale.client_identifier, package.commands.command)

    } else if (package.commands.command.plano.includes('Aluguel')) {

      execution = await commandExecute.setServidor(sale.client_identifier, sale.client_email, package.commands.command, sale.created_at)

    } else if (['UNBAN', 'UNMUTE'].some(v => package.commands.command.plano.includes(v))) {

      execution = await commandExecute.setUnban_Unmute(sale.client_identifier, sale.client_discord, package.commands.command.plano)

    } else {
      execution = { error: 'Comando não encontrado' }
    }

    if (execution && execution['error']) {
      package.status = 'Erro'
      errors.push({ description: execution.error, id: package.id })
      return sendMessage.error(
        'ERRO',
        `A compra do ID **${sale.internal_id}** possui o comando a seguir errado:
        Comando:
        \`\`\`${JSON.stringify(package.commands.command)}\`\`\`
        Erro:
        \`\`\`${execution.error}\`\`\``)
    } else {
      package.status = 'Enviado'
    }

    execution = await commandExecute.setDatabaseCompras_Pacotes(sale.internal_id, package)
    if (execution && execution['error']) {
      return sendMessage.error(
        'ERRO DATABASE',
        `A compra do ID **${sale.internal_id}** apresentou erro no setDatabaseCompras_Pacotes:
        Comando:
        \`\`\`${JSON.stringify(package.commands.command)}\`\`\`
        Erro:
        \`\`\`${execution.error}\`\`\``)
    }
  })

  sendMessage.successCompra(sale, errors)
  new Email(sale).packaSent().catch(() => { })

  execution = await commandExecute.setDatabaseCompras(sale)
  if (execution && execution['error']) {
    return sendMessage.error(
      'ERRO DATABASE',
      `A compra do ID **${sale.internal_id}** apresentou erro no setDatabaseCompras:
        Erro:
        \`\`\`${execution.error}\`\`\``)
  }
}