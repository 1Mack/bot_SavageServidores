const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js');
const { connection, panelApiKey } = require('../../../configs/config_privateInfos');
const { serversInfos } = require('../../../configs/config_geral');
const wait = require('util').promisify(setTimeout);


exports.HorasDemotarConfirm = async function (user, message, client) {
    let servidor = message.embeds[0].footer.text,
        discordId = message.embeds[0].fields[1].value,
        steamid = message.embeds[0].fields[0].value,
        name = message.embeds[0].title

    let fetchUser

    const con = connection.promise();
    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    try {
        fetchUser = await client.guilds.cache.get("343532544559546368").members.cache.get(discordId.substring(2, 20));
    } catch (error) { }

    await con.query(`delete from vip_sets where steamid = '${steamid}'
    and server_id = (select id from vip_servers where server_name = '${servidor}')`);
    await con.query(`delete from mostactive_${servidor} where steamid = '${steamid}'`).catch(() => { })

    const logDemoted = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser ? fetchUser.user.username.toString() : name.toString())
        .addFields(
            {
                name: 'discord',
                value: fetchUser ? fetchUser.user.toString() : discordId.toString(),
            },
            { name: 'Steamid', value: steamid.toString() },
            { name: 'Servidor', value: servidor.toUpperCase() },
            { name: 'Observações', value: 'Não cumpriu a meta de 20h' }
        )
        .setFooter({ text: `Demotado ${user.username} no HORASDEMOTAR` });

    if (fetchUser) {
        const demotedSendMSG = new MessageEmbed()
            .setColor('FF0000')
            .setTitle(`Olá ${fetchUser.user.username}`)
            .setDescription(
                `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
            )
            .addFields(
                { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
                { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
                { name: '**Motivo**', value: `\`\`\`Ter menos do que 20 horas\`\`\`` }
            );

        let staffRoles = serversInfos.flatMap(m => [m.tagComprado, m.tagDoCargo])

        staffRoles = fetchUser._roles.filter(m => staffRoles.includes(m))

        if (staffRoles.length > 1) {
            fetchUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]).catch(() => { })
        } else {
            fetchUser.roles.remove([
                serversInfosFound.tagDoCargo,
                '722814929056563260',
                serversInfosFound.tagComprado,
            ]).catch(() => { })

            fetchUser.setNickname(fetchUser.user.username).catch(() => { });
        }


        fetchUser.send({ embeds: [demotedSendMSG] }).catch(() => { })

    }

    client.guilds.cache.get("792575394271592458").channels.cache.find((channel) => channel.id == '792576104681570324').send({ embeds: [logDemoted] });


    const [result2] = await con.query(
        `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
    );
    let setInfos = result2.map((item) => {
        return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${item.isVip == 1
            ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
            : `(${item.discord_id})`
            })`;
    });

    setInfos = setInfos.join('\n');

    for (let j in serversInfosFound.identifier) {
        try {
            await fetch(
                `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]
                }/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        Accept: 'application/json',
                        Authorization: `Bearer ${panelApiKey.api}`,
                    },
                    body: setInfos,
                }
            );
        } catch (error) {
            return (
                await client.guilds.cache.get("792575394271592458").channels.cache.find((channel) => channel.id == '795504520876130306').send({
                    content:
                        `${user} **| Não consegui remover o cargo do staff de dentro do servidor, entre em contato com o 1Mack**`
                }),
                console.log(error)
            );
        }

        try {
            fetch(
                `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]
                }/command`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${panelApiKey.api}`,
                    },
                    body: JSON.stringify({ command: 'sm_reloadadmins' }),
                }
            );
        } catch { }
    }
}