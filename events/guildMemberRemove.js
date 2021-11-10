const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'guildMemberRemove',
    once: 'on',
    async execute(member, client) {
        
         const embed = new MessageEmbed()
        .setColor('#F20707')
        .setAuthor(member.user.username.toString(), member.user.displayAvatarURL({dynamic: true}))
        .setTitle('***Membro Saiu***')
        .addFields(
            { name: 'Discord', value: member.user.toString(), inline: true },
            {
                name: 'Entrou no Servidor Dia',
                value: new Date(Number(member.joinedTimestamp)).toLocaleDateString('en-GB').toString(),
                inline: true,
            },
            { name: 'Membro Número', value: member.guild.memberCount.toString(), inline: false },
            { name: 'Cargos', value: member._roles.map(m => `<@&${m}>`).toString(), inline: false }
            
        )
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
    client.channels.cache.get('716023078374867036').send({embeds: [embed]});  

    if(member._roles.find(m => ['711022747081506826', '780582159731130378', '722814929056563260', '753728995849142364'].includes(m))){
     client.channels.cache.get('888609571894087770').send({content: '<@323281577956081665>', embeds: [embed]});  
     }
    },
};
