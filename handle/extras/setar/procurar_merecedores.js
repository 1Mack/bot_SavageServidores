const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { connection } = require('../../../configs/config_privateInfos');
const { serversInfos } = require('../../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

exports.UP_Procurar_merecedores = async function (client, interaction, servidor) {

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (!interaction.member.roles.cache.has(serversInfosFound.gerenteRole) && !interaction.member.roles.cache.has('831219575588388915'))
        return interaction.reply({
            content: `😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`, ephemeral: true
        })

    const con = connection.promise();

    let canalCheck = await client.channels.cache.find((m) => m.name === `upando→${interaction.user.id}`);

    if (canalCheck === undefined) {
        await interaction.guild.channels.create(`upando→${interaction.user.id}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '936310042225934408',
        });
        canalCheck = await client.channels.cache.find((m) => m.name === `upando→${interaction.user.id}`);
    }
    await interaction.deferReply()
    interaction.followUp({ content: `[Canal criado com sucesso!!!](https://discord.com/channels/343532544559546368/${canalCheck.id})` }).then(m => {
        setTimeout(() => {
            m.delete()
        }, 5000);
    })

    await canalCheck.bulkDelete(100);

    let msg = await canalCheck.send(`${interaction.user}`)

    let [result] = await con.query(
        `select * from mostactive_${servidor} inner join vip_sets
            on mostactive_${servidor}.steamid = vip_sets.steamid
            where isVip = '0'
            and cargo != 'fundador'
            and cargo != 'diretor'
            and cargo != 'gerente'
            and server_id = (select id from vip_servers where server_name = '${servidor}')`
    ).catch(err => {
        return (
            console.error(err),
            msg.edit({ content: 'Ouve um erro inesperado', embeds: [], components: [] })
        )
    })

    if (result == '') {
        return (
            await msg.edit({ content: 'Houve algum erro inesperado!! Deletando canal' }),
            await wait(6000),
            canalCheck.delete()
        );
    }
    let outloop
    for (let i in result) {
        const logGuildUpConfirm = await client.guilds.cache.get('792575394271592458').channels.cache.get('931637295902240838')

        const logGuildUpConfirmMessages = await logGuildUpConfirm.messages.fetch().then(m =>
            m.find(m => m.embeds[0].fields.find(a => a.name == 'DiscordID' && a.value == result[i].discord_id) && m.embeds[0].footer.text == servidor)
        )

        if (logGuildUpConfirmMessages) {
            continue;
        }


        function HourFormat(duration) {
            let hrs = ~~(duration / 3600);
            let mins = ~~((duration % 3600) / 60);

            if (mins == 0) {
                return `${hrs} horas`
            } else if (hrs == 0) {
                return `${mins} minutos`
            } else {
                return `${hrs} horas e ${mins} minutos`
            }
        }

        let formMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(result[i].name.toString())
            .addFields(
                { name: 'Steamid', value: result[i].steamid.toString() },
                { name: 'DiscordID', value: `<@${result[i].discord_id}>` },
                { name: 'Cargo', value: result[i].cargo.toString() },
                { name: 'Último Set', value: result[i].date_create.toString() },
                { name: `**Horas Totais**`, value: HourFormat(result[i].total) },
                { name: `**Horas Spec**`, value: HourFormat(result[i].timeSPE) },
                { name: `**Horas TR**`, value: HourFormat(result[i].timeTT) },
                { name: `**Horas CT**`, value: HourFormat(result[i].timeCT) },
                { name: `**Última conexao**`, value: new Date(result[i].last_accountuse * 1000).toLocaleDateString('en-GB') },

            )
            .setFooter({ text: servidor.toString() })
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('up_confirm')
                    .setLabel('Upar')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('up_proximo')
                    .setLabel('Proximo')
                    .setStyle('PRIMARY'),

            );
        await msg.edit({ content: ' ', embeds: [formMessage], components: [row] });

        const filter = i => {
            i.deferUpdate();
            return i.user.id == interaction.user.id && i.channelId == canalCheck.id;
        };

        await canalCheck
            .awaitMessageComponent({ filter, time: 100000, errors: ['time'] })
            .then(async ({ customId }) => {


                if (customId == 'up_proximo') {

                    return;

                } else if (customId == 'up_confirm') {

                    const row2 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('up_confirm2')
                                .setLabel('Upar')
                                .setStyle('DANGER'),
                            new MessageButton()
                                .setCustomId('up_recusado')
                                .setLabel('Rejeitar')
                                .setStyle('PRIMARY'),

                        );

                    await msg.edit({ content: 'Diga o por quê você acha que ele deve ser upado! (Você tem 45s)', embeds: [], components: [] }).then(async (m) => {

                        const filterMSG = (m) => m.author === interaction.user;

                        await m.channel
                            .awaitMessages({
                                filterMSG,
                                max: 1,
                                time: 45000,
                                errors: ['time'],
                            })
                            .then(async (message) => {
                                message = message.first();
                                message.delete();

                                formMessage.addFields(
                                    { name: `**Motivo do UP**`, value: message.content.toString() },
                                    { name: `**Sugerido Pelo**`, value: interaction.user.username.toString() },
                                )

                                canalCheck.send(`Staff <@${result[i].discord_id}> enviado para análise com sucesso!`).then(async m => setTimeout(() => m.delete(), 5000))

                                logGuildUpConfirm.send({ embeds: [formMessage], components: [row2] }).then(message => {
                                    let embedDiretorMSG = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`[Novo staff para ser upado](https://discord.com/channels/792575394271592458/931637295902240838/${message.id})`);

                                    interaction.guild.channels.cache.get('873396752760307742').send({ embeds: [embedDiretorMSG], content: '<@everyone>' })
                                })

                            })
                            .catch(() => {
                                return (msg.edit({
                                    content:
                                        '**Você não respondeu a tempo!!! lembre-se, você tem apenas 15 segundos para responder!** \n***Irei pular esse staff*** <a:savage_loading:837104765338910730>',
                                })
                                    .then(() => setTimeout(() => interaction.deleteReply(), 10000)));
                            });
                    })


                }
            })
            .catch(async (error) => {

                await msg.edit({ content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: [] })
                if (error.code !== 'INTERACTION_COLLECTOR_ERROR') {
                    console.log(error)
                }
                await wait(5000)
                outloop = true
            });

        if (outloop) {
            break;
        }
    }

    if (!outloop) {
        await msg.edit({ content: 'todos os staffs ja foram vistos!\n**Deletando canal em 5 segundos!!**', embeds: [], components: [] });
    }

    await wait(5000)
    await canalCheck.delete();


};
