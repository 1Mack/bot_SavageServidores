/* const { EmbedBuilder } = require('discord.js');
const { serversInfos, guildsInfo } = require('../../configs/config_geral');

async function checkChannels(message, client) {

    const mainEmbed = message.embeds[0]
    let usuarioInfo = {
        id: mainEmbed.title,
        info: mainEmbed.fields[1].value,
        servidor: mainEmbed.fields[0].value,
        codigo: mainEmbed.fields[2].value,
    };
    let guild = client.guilds.cache.get(guildsInfo.log),
        guildMain = client.guilds.cache.get(guildsInfo.main)

    const canal = guild.channels.cache.find((channel) => channel.id === '795504520876130306');

    let fetchedUser

    try {
        fetchedUser = await guildMain.members.cache.get(usuarioInfo.id);
    } catch (error) {
        return (
            canal.send({
                content:
                    `**O player <@${usuarioInfo.id}> não está no discord da savage, mas eu já removi ele do admins_simple.**`
            })
        );
    }

    if (!fetchedUser) {
        return;
    }

    const embedVipExpirado = new EmbedBuilder()
        .setColor('#0066FF')
        .setTitle(`Olá ${fetchedUser.user.username}`)
        .setDescription(
            `> O tempo do seu cargo comprado acabou 😿
> Mas não fique triste, tenho uma ótima notícia para você!
> Estou te dando um **código promocional de 15% de desconto** para renovação do seu plano 😍`
        )
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Seu Código', value: usuarioInfo.codigo.toString() },
            {
                name: 'Como faço para resgatar?',
                value: `Basta ir no canal: <#855200110685585419>, após isso abra um ticket e escreva a seguinte mensagem:

  \`\`\`fix\nQuero renovar meu plano com o código ${usuarioInfo.codigo.substr(3, 5)}\`\`\``,
                inline: false,
            },
            {
                name: 'Regras',
                value: `\`\`\`md\n# O código é único e exclusivo seu, ou seja, não pode ser transferido!\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n# Você tem 1 semana, à partir da data de hoje, para resgata-lo\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n# Qualquer dúvida não hesite em perguntar, estamos a sua disposição\`\`\``,
                inline: false,
            }
        )
        .setImage('https://cdn.discordapp.com/attachments/719223540783775804/730203351521689660/savage.png');


    await fetchedUser.send({ embeds: [embedVipExpirado] }).catch(() => { })


    const serversInfosFound = serversInfos.find((m) => m.name === usuarioInfo.servidor);

    if (serversInfosFound == undefined) return canal.send({
        content:
            `😫 **| Não achei o servidor o qual o <@${usuarioInfo.id}> expirou o cargo comprado**`
    });

    if (usuarioInfo.info.includes('@vip')) {

        let vipRoles = serversInfos.map(m => m.tagVip)

        vipRoles = fetchedUser._roles.filter(m => vipRoles.includes(m))


        if (vipRoles.length > 1) {
            await fetchedUser.roles.remove(serversInfosFound.tagVip);
            canal.send({ content: `**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso` });
        } else {
            fetchedUser.roles.remove([serversInfosFound.tagVip, '753728995849142364']);
            canal.send({ content: `**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso` });
            fetchedUser.setNickname(fetchedUser.user.username).catch(() => { })
        }

    } else {

        let staffRoles = serversInfos.flatMap(m => [m.tagComprado, m.tagDoCargo])

        staffRoles = fetchedUser._roles.filter(m => staffRoles.includes(m))

        if (staffRoles.length > 1) {
            await fetchedUser.roles.remove(serversInfosFound.tagComprado);
            canal.send({ content: `**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso` });
        } else {
            fetchedUser.roles.remove([serversInfosFound.tagComprado, '722814929056563260']);
            canal.send({ content: `**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso` });
            fetchedUser.setNickname(fetchedUser.user.username).catch(() => { })
        }
    }
}

module.exports = {
    checkChannels,
};
 */