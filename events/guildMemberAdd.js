const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'guildMemberAdd',
    once: 'on',
    async execute(member, client) {
        await member.fetch()

        const embed = new MessageEmbed()
            .setColor('#00F180')
            .setAuthor(member.user.username.toString(), member.user.displayAvatarURL({dynamic: true}))
            .setTitle('***Novo Membro***')
            .addFields(
                { name: 'Discord', value: member.user.toString(), inline: true },
                {
                    name: 'Conta criada dia',
                    value: new Date(Number(member.user.createdTimestamp)).toLocaleDateString('en-GB').toString(),
                    inline: true,
                },
                { name: 'Membro Número', value: member.guild.memberCount.toString() }
            )
            .setFooter(`ID: ${member.user.id}`)
            .setTimestamp();

        client.channels.cache.get('716023078374867036').send({embeds: [embed]});  

        if(member._roles.find(m => m!= '808436147054706688')){
           embed.addField('Cargos', member._roles.map(m => `<@&${m}>`).toString())
        client.channels.cache.get('888609571894087770').send({content: '<@323281577956081665>', embeds: [embed]});  
           
        }

        member.roles.add('808436147054706688');
        
    },
};
