const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { connection } = require('../../../configs/config_privateInfos');

const { NotTarget } = require('./embed');
const { PlayerDiscordNotFound, InternalServerError } = require('../../../embed/geral');
const chalk = require('chalk');


exports.UP_Especifico = async function (client, interaction, { id: discordUser } = discordUser, servidor, motivo) {

    await interaction.deferReply()


    let result;
    const con = connection.promise();

    try {
        [result] = (await con.query(
            `select * from mostactive_${servidor} inner join vip_sets
            on mostactive_${servidor}.steamid = vip_sets.steamid
            where discord_id = '${discordUser}'
            and server_id = (select id from vip_servers where server_name = '${servidor}')`
        ))[0]
    } catch (error) {
        return (
            interaction.followUp({ embeds: [InternalServerError(interaction)] }).then(m => {
                setTimeout(() => {
                    m.delete()
                }, 7000);
            }),
            console.error(chalk.redBright('Erro no Select'), error)
        );
    }

    if (result == undefined) {
        return (
            interaction.followUp({ embeds: [PlayerDiscordNotFound(interaction)] }).then(m => {
                setTimeout(() => {
                    m.delete()
                }, 7000);
            })
        );
    }

    if (
        (discordUser == '323281577956081665' || ['fundador', 'diretor', 'gerente', 'supervisor'].includes(result.cargo)) &&
        interaction.user.id !== '323281577956081665'
    )
        return interaction.followUp({ embeds: [NotTarget(interaction)] }).then(m => {
            setTimeout(() => {
                m.delete()
            }, 7000);
        })

    const logGuildUpConfirm = await client.guilds.cache.get('792575394271592458').channels.cache.get('931637295902240838')

    const logGuildUpConfirmMessages = await logGuildUpConfirm.messages.fetch().then(m =>
        m.find(m => m.embeds[0].fields.find(a => a.name == 'DiscordID' && a.value == result.discord_id) && m.embeds[0].footer.text == servidor)
    )

    if (logGuildUpConfirmMessages) {
        return (
            interaction.followUp({ embeds: [], content: 'Esse staff já esta em análise para ser upado!!!' }).then(m => {
                setTimeout(() => {
                    m.delete()
                }, 7000);
            })
        );
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

    let staffInfosMessage = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(result.name.toString())
        .addFields(
            { name: 'Steamid', value: result.steamid.toString() },
            { name: 'DiscordID', value: `<@${result.discord_id}>` },
            { name: 'Cargo', value: result.cargo.toString() },
            { name: 'Último Set', value: result.date_create.toString() },
            { name: `**Horas Totais**`, value: HourFormat(result.total) },
            { name: `**Horas Spec**`, value: HourFormat(result.timeSPE) },
            { name: `**Horas TR**`, value: HourFormat(result.timeTT) },
            { name: `**Horas CT**`, value: HourFormat(result.timeCT) },
            { name: `**Última conexao**`, value: new Date(result.last_accountuse * 1000).toLocaleDateString('en-GB') },
            { name: `**Motivo do UP**`, value: motivo.toString() },
            { name: `**Sugerido Pelo**`, value: interaction.user.username.toString() },

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
                .setLabel('Cancelar')
                .setStyle('PRIMARY'),

        );
    const msg = await interaction.followUp({ content: ' ', embeds: [staffInfosMessage], components: [row] });

    const filter = i => {
        i.deferUpdate();
        return i.user.id == interaction.user.id && i.message.id == msg.id;
    };

    await interaction.channel
        .awaitMessageComponent({ filter, time: 20000, errors: ['time'] })
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

                msg.edit({ content: `Staff <@${result.discord_id}> enviado para análise com sucesso!`, embeds: [], components: [] })
                    .then(async m => setTimeout(() => m.delete(), 5000))

                logGuildUpConfirm.send({ embeds: [staffInfosMessage], components: [row2] }).then(message => {
                    let embedDiretorMSG = new MessageEmbed()
                        .setColor('#00ff00')
                        .setDescription(`[Novo staff para ser upado](https://discord.com/channels/792575394271592458/931637295902240838/${message.id})`);

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

}