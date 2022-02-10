const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js');
const { connection, panelApiKey } = require('../../../../configs/config_privateInfos');
const { serversInfos, normalServerRoles } = require('../../../../configs/config_geral');


exports.UpConfirmed = async function (message, client, reactionPerson) {
    let servidor = message.embeds[0].footer.text,
        cargo = normalServerRoles[normalServerRoles.findIndex(m => m == message.embeds[0].fields.find(m => m.name.includes('Cargo')).value) + 1],
        discord_id = message.embeds[0].fields.find(m => m.name.includes('DiscordID')).value.replace(/[<@>]/g, ''),
        discordName = message.embeds[0].title,
        steamid = message.embeds[0].fields.find(m => m.name.includes('Steamid')).value,
        upReason = message.embeds[0].fields.find(m => m.name.includes('Motivo')).value,
        suggestedBy = message.embeds[0].fields.find(m => m.name.includes('Sugerido')).value

    if (cargo == undefined) {
        return (message.edit({ content: `Esse staff já esta no cargo mais alto possível ou ele não tem set no servidor ${servidor}`, embeds: [], components: [] }).then(m => setTimeout(() => {
            m.delete()
        }, 5000)))
    } else if (['gerente', 'diretor', 'fundador'].includes(cargo) && reactionPerson.id != '323281577956081665') {
        return (message.channel.send({ content: `${reactionPerson} | O próximo cargo desse staff só pode ser autorizado pelo 1MaaaaaacK` }
        ).then(m => setTimeout(() => {
            m.delete()
        }, 5000)))
    }
    let fetchUser

    const con = connection.promise();
    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    try {
        fetchUser = await client.guilds.cache.get("343532544559546368").members.cache.get(discord_id);
    } catch (error) { }

    let dataInicial = Date.now();
    dataInicial = Math.floor(dataInicial / 1000);
    let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');


    await con.query(`update vip_sets set cargo = '${cargo}', date_create = '${DataInicialUTC}' where steamid = '${steamid}'
    and server_id = (select id from vip_servers where server_name = '${servidor}')`);

    const logUp = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser.user.username.toString())
        .addFields(
            { name: 'Discord', value: `<@${discord_id}>` },
            { name: 'Steamid', value: steamid.toString() },
            { name: 'Cargo', value: cargo.toString() },
            { name: 'Servidor', value: servidor.toString() },
            { name: 'Motivo do UP', value: upReason.toString() }
        )
        .setTimestamp()
        .setFooter({ text: `Set sugerido pelo ${suggestedBy}` })

    if (!fetchUser) return (

        message.edit({ content: `${discordName} não esta no discord **OU** não consegui achá-lo, sugiro você conferir isso!`, components: [], embeds: [] }.then(m => {
            setTimeout(() => {
                m.delete()
            }, 10000);
        }))
    )

    const upSendMSG = new MessageEmbed()
        .setColor('0099ff')

        .setTitle(`Olá ${fetchUser.user.username}`)
        .setDescription(
            `Devido aos seus esforços, estamos lhe promovendo para um cargo mais alto, ***parabéns*** 🥳🥳
            
            Ah, só não se esqueça, quanto maior o cargo, maior a responsabilidade 😎***`
        )
        .addFields(
            { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
            { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
            { name: '**Novo Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
            { name: '**Motivo**', value: `\`\`\`${upReason}\`\`\`` }
        )
        .setFooter({ text: `Set sugerido pelo ${suggestedBy}` });

    fetchUser.send({ embeds: [upSendMSG] }).catch(() => { })



    client.guilds.cache.get("792575394271592458").channels.cache.find((channel) => channel.id == '934146416400564345').send({ embeds: [logUp] });


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
                        `${reactionPerson} **| Não consegui upar o staff, entre em contato com o 1Mack**`
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


        message.edit({ content: `**${discordName}** foi upado com sucesso`, embeds: [], components: [] }).then(m => {
            setTimeout(() => {
                m.delete()
            }, 5000);
        })
    }
}