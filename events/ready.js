const { guildsInfo } = require('../configs/config_geral');
const { CheckMemberCount } = require('../handle/extras/CheckMemberCount');
const { ServerStatus } = require('../handle/extras/serverStatus');

const wait = require('util').promisify(setTimeout);

module.exports = {
  name: 'ready',
  once: 'once',
  async execute(client) {
    console.log('Conectado como ' + client.user.tag);
    client.user.setActivity('Savage Servidores');
    await client.guilds.cache.get(guildsInfo.main).members.fetch()
    console.log('Membros Carregados')
    
    let channel = await client.channels.fetch('717331699125714986')

    await channel.bulkDelete(100)

       await channel.send({ embeds: (await ServerStatus(client)) }).then(msg => {
        setInterval(async () => {
          msg.edit({ embeds: (await ServerStatus(client)) })
          CheckMemberCount(client)
        }, 300000)
      }) 
  },
};
