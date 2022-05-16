/* const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookVipExpirado, webhookSavageLogs } = require('../../configs/config_webhook');
const { serversInfos } = require('../../configs/config_geral');
const { panelApiKey, connection } = require('../../configs/config_privateInfos');

const webhookLogs = new WebhookClient({ id: webhookVipExpirado.id, token: webhookVipExpirado.token });
const webhookChecagemLogs = new WebhookClient({ id: webhookSavageLogs.id, token: webhookSavageLogs.token });

exports.Checagem = async function () {
    let rows;
    const con = connection.promise();
    let dataInicial = Date.now();
    dataInicial = Math.floor(dataInicial / 1000);

    try {
        [rows] = await con.query(
            `SELECT * FROM vip_sets INNER JOIN vip_servers ON vip_sets.server_id = vip_servers.id where vip_sets.date_final != 0 AND vip_sets.isVip = '1'`
        );
    } catch (error) { }


    let vipsRemoved = []

    rows.forEach(async (element) => {
        let data_compare = element.date_final.split('/');
        data_compare = new Date(data_compare[2], data_compare[1] - 1, data_compare[0]).getTime() / 1000;
        if (data_compare > dataInicial) return;

        let codigo = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

        const logVipExpirado = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(element.discord_id)
            .addFields(
                { name: 'Servidor', value: element.server_name },
                {
                    name: 'Informações',
                    value: `\`\`\`"${element.steamid}  "@${element.cargo}"  //"${element.name} (${element.date_create} - ${element.discord_id} - ${element.date_final}\`\`\``,
                },
                { name: 'Código', value: `\`\`\`${codigo}\`\`\`` }
            )
            .setTimestamp();

        if (!vipsRemoved.find(m => m == element.server_name)) {
            vipsRemoved.push(element.server_name)

        }

        webhookLogs.send({
            username: 'SavageLog',
            avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
            embeds: [logVipExpirado],
        });

        try {
            [rows] = await con.query(`delete FROM vip_sets where discord_id = '${element.discord_id}' and server_id = ${element.server_id}`);
        } catch (error) {
            return (
                console.log(error),
                webhookChecagemLogs.send(`**Não consegui deletar os sets no servidor ${element.server_name}**`, {
                    username: 'SavageLogs',
                    avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                })
            )


        }




    });
    for (let i in vipsRemoved) {
        const serverFound = serversInfos.find(m => m.name == vipsRemoved[i])



        let setInfos;
        try {
            [rows] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${serverFound.name}')`
            );
            setInfos = rows.map((item) => {
                if (rows.isVip == 0) {
                    return `"${item.steamid}"  "@${item.cargo}" //${item.name} (${item.date_create} - ${item.discord_id} - ${item.date_final})`;
                } else {
                    return `"${item.steamid}"  "@${item.cargo}" //${item.name} (${item.discord_id})`;
                }
            });
        } catch (error) {
            webhookChecagemLogs.send(
                `**Deletei os sets no servidor ${serverFound.identifier}, porém não consegui setá-los no servidor!**`,
                {
                    username: 'SavageLogs',
                    avatarURL:
                        'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                }
            );
            console.log(error);
            continue;
        }

        setInfos = setInfos.join('\n');
    }
}
 */