const {checkChannels} = require('../handle/checks/checkChannels')
const { serverStatus } = require('../handle/extras/serverStatus')

module.exports = {
    name: 'messageCreate',
    once: 'on',
    async execute(message, client) {
        if(message.channelId == '717331699125714986'){
            if(message.content == 'RELOADING'){
                await message.channel.bulkDelete(100)

                
                let msg = await message.channel.send('reloaded')

                serverStatus(msg, client)
                
                setInterval(async ()=> {
                    serverStatus(msg, client)

                }, 300000)

            }
        }else if(message.channelId == '795494831291891774'){
            checkChannels(message, client)
        }


        
    },
} 
 