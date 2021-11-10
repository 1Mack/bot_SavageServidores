const { query } = require('gamedig');
const {host} = require('../../configs/config_geral')
const { MessageEmbed} = require('discord.js')

    exports.serverStatus = async function(msg, client) {                

            let Catch = [];

            for (let i in host) {
                await query({
                    type: 'csgo',
                    host: host[i].host,
                    port: host[i].port,
                })
                    .then((state) => {
                        
                        Catch[i] = {
                            name: state.name,
                            mapa: state.map,
                            players: state.raw.numplayers,
                            playersTotal: state.maxplayers,
                            ip: state.connect,
                        };
                    })
                    .catch((error) => {
                        Catch[i] = { name: 'off', mapa: 'off', players: 0, playersTotal: 0, ip: 'off' };
                        
                    });
            }
        

        
            let CatchFormat =  Catch.map((m, i) => {
                return `<a:diamante:650792674248359936> **${m.name}** <a:diamante:650792674248359936>\n\n**Mapa:** ${m.mapa}\n**Players:** ${m.players}/${m.playersTotal}\n**IP:** steam://connect/${m.ip}${i + 1 == Catch.length ? '' : '\n▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂\n\n'}`
            })
            let embedImg = new MessageEmbed()
                .setColor('36393f')
                .setImage('https://cdn.discordapp.com/attachments/814295769699713047/877679866219233350/ip-dos-servidores.gif')
            let embed = new MessageEmbed()
                .setColor('36393f')
                .setDescription(CatchFormat.toString())
                .setFooter('A lista atualizada a cada 5 minutos')
                .setTimestamp()
            let cont = 0, contTotal = 0
                for(let i in Catch) {
                    cont += Catch[i].players
                    contTotal += Catch[i].playersTotal
                }
            let EmbedPlayersTotal = new MessageEmbed()
                .setColor('#5F40C1')
                .setTitle('Players Online')
                .setTimestamp()
                .setDescription(`\`\`\`${cont}/${contTotal}\`\`\``) 

            
                msg.edit({content: ' ', embeds: [embedImg, embed]})
                client.channels.cache.get('825124273655250984').send({embeds: [EmbedPlayersTotal]})

        
} 
 