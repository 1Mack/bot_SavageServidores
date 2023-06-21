const { guildsInfo } = require('../configs/config_geral');
const { CheckServerAluguel } = require('../handle/checks/checkServerAluguel');
const { RunStore } = require('../handle/checks/store/checkStore');
const { CheckMemberCount } = require('../handle/extras/CheckMemberCount');
const { ServerStatus } = require('../handle/extras/serverStatus');

module.exports = {
  name: 'ready',
  once: 'once',
  async execute(client) {
    console.log('Conectado como ' + client.user.tag);
    client.user.setActivity('Savage Servidores');
    await client.guilds.cache.get(guildsInfo.main).members.fetch()
    console.log('Membros Carregados')
    await client.guilds.cache.get(guildsInfo.main).channels.fetch()
    console.log('Canais Carregados')

    RunStore()
    CheckServerAluguel(client)
    let channel = await client.guilds.cache.get(guildsInfo.main).channels.cache.get('717331699125714986')

    await channel.bulkDelete(100)
    await channel.send({ embeds: (await ServerStatus(client)) }).then(msg => {
      setInterval(async () => {
        msg.edit({ embeds: (await ServerStatus(client)) })
        CheckMemberCount(client)
      }, 30000)
    })
  },
};
