const { guildsInfo } = require('../configs/config_geral');

const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'ready',
    once: 'once',
    async execute(client) {
        console.log('Conectado como ' + client.user.tag);
        client.user.setActivity('Savage Servidores');
        await client.guilds.cache.get(guildsInfo.main).members.fetch()
        console.log('Membros Carregados')

        await wait(5000)
        client.channels.cache.get('717331699125714986').send('RELOADING')

        await wait(5000)

        client.channels.cache.get('717331699125714986').messages.fetch().then(msg => {
            if (msg.find(m => m.content.includes('RELOADING'))) return client.channels.cache.get('717331699125714986').send('RELOADING')

        })

    },
};
