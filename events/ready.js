
module.exports = {
    name: 'ready',
    once: 'once',
    async execute(client) {
        console.log('Conectado como ' + client.user.tag);
        client.user.setActivity('Savage Servidores');
        await client.guilds.cache.get('343532544559546368').members.fetch()
        console.log('Membros Carregados')
       

        client.channels.cache.get('717331699125714986').send('RELOADING')

       

    },
};
