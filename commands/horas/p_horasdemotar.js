const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'horasdemotar',
    description: 'Ver as horas in-game dos staffs',
    options: [{ name: 'servidor', type: 3, description: 'Escolha um Servidor', required: true, choices: serversInfos.map(m => { return { name: m.name, value: m.name } }) }],
    default_permission: false,
    cooldown: 0,
    permissions: [{ id: '711022747081506826', type: 1, permission: true }, // Gerente
    { id: '831219575588388915', type: 1, permission: true }], //perm set
    async execute(client, interaction) {

        let servidor = interaction.options.getString('servidor').toLowerCase()

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (!interaction.member.roles.cache.has(serversInfosFound.gerenteRole) && !interaction.member.roles.cache.has('831219575588388915'))
            return interaction.reply({
                content: `😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            })
                .then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const con = connection.promise();

        let canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);

        if (canalCheck === undefined) {
            await interaction.guild.channels.create(`horasdemotar→${interaction.user.id}`, {
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
            canalCheck = await client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);
        }
        await interaction.deferReply()
        interaction.followUp({ content: `Canal criado com sucesso <#${canalCheck.id}>` }).then(m => {
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
            and total < '72000'
            and server_id = (select id from vip_servers where server_name = '${servidor}')`
        );

        if (result == '') {
            return (
                await msg.edit({ content: 'Não achei ninguém com hora menor!! Deletando canal' }),
                await wait(6000),
                canalCheck.delete()
            );
        }
        let outloop
        for (let i in result) {
            const logGuildDemotarConfirm = await client.guilds.cache.get('792575394271592458').channels.cache.get('914623602186395778')

            const logGuildDemotarConfirmMessages = await logGuildDemotarConfirm.messages.fetch().then(m =>
                m.find(m => m.embeds[0].fields.find(a => a.name == 'DiscordID' && a.value == result[i].discord_id) && m.embeds[0].footer.text == servidor)
            )

            if (logGuildDemotarConfirmMessages) {
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
                .setTitle(result[i].name ? result[i].name.toString() : 'Indefinido')
                .addFields(
                    { name: 'Steamid', value: result[i].steamid.toString() },
                    { name: 'DiscordID', value: `<@${result[i].discord_id}>` },
                    { name: 'Cargo', value: result[i].cargo.toString() },
                    { name: 'Último Set', value: result[i].date_create ? result[i].date_create.toString() : 'Indefinido' },
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
                        .setCustomId('horasdemotar_confirm')
                        .setLabel('Demotar')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('horasdemotar_proximo')
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
                .then(async (collected) => {
                    collected = collected.customId

                    if (collected == 'horasdemotar_proximo') {

                        return;

                    } else if (collected == 'horasdemotar_confirm') {

                        const row2 = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('horasdemotar_demotar2')
                                    .setLabel('Demotar')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId('horasdemotar_recusado')
                                    .setLabel('Rejeitar')
                                    .setStyle('PRIMARY'),

                            );

                        await canalCheck.send(`Staff <@${result[i].discord_id}> enviado para análise com sucesso!`).then(async m => setTimeout(() => m.delete(), 5000))

                        logGuildDemotarConfirm.send({ embeds: [formMessage], components: [row2] }).then(message => {
                            let embedDiretorMSG = new MessageEmbed()
                                .setColor('#00ff00')
                                .setDescription(`[Novo staff para ser demotado](https://discord.com/channels/792575394271592458/931637295902240838/${message.id})`);

                            interaction.guild.channels.cache.get('873396752760307742').send({ embeds: [embedDiretorMSG], content: '<@everyone>' })
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

    },
};
