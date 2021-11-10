const { connection } = require('../../configs/config_privateInfos');
const { PlayerDiscordNotFound, InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');
const Discord = require('discord.js');
module.exports = {
    name: 'cargos',
    description: 'Ver os cargos do player in-game',
    options: [{name: 'discord', type: 6, description: 'discord do player', required: true, choices: null}],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}],
    async execute(client, interaction) {
        let discord1 = interaction.options.getUser('discord')

        

        try {
            var fetchUser = await client.users.fetch(discord1.id);
        } catch (error) {
            return interaction.reply({embeds: [PlayerDiscordNotFound(interaction)]});
        }
        
        let StaffFoundEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(fetchUser.username);
        let StaffFoundEmbed2 = new Discord.MessageEmbed().setColor('#0099ff').setTimestamp();

        let rows;
        const con = connection.promise();

        try {
            [rows] = await con.query(
                `select * from vip_sets inner join vip_servers
            on vip_sets.server_id = vip_servers.id
            where discord_id ='${discord1.id}'`
            );
        } catch (error) {
            return (
                interaction.reply({embeds: [InternalServerError(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000)),
                console.error(chalk.redBright('Erro no Banimento'), error)
            );
        }
        if (rows == '') {
            return interaction.reply({content: `**<@${interaction.user.id}> | Não encontrei**`}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }

        rows.forEach((m, i) => {
            if (i < 5) {
                StaffFoundEmbed = StaffFoundEmbed.addField(
                    `<a:diamante:650792674248359936> **${m.server_name}** <a:diamante:650792674248359936>`,
                    '\u200B'
                );

                StaffFoundEmbed = StaffFoundEmbed.addFields(
                    { name: `\u200B`, value: `**set**`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    {
                        name: `\u200B`,
                        value: `\`\`\`${`"${m.steamid}"  "@${m.cargo}" //${
                            m.isVip == 0
                                ? `${m.name}  (${m.discord_id})`
                                : `${m.name} (${m.date_create} - ${m.discord_id} - ${m.date_final})`
                        }`}\`\`\``,
                        inline: true,
                    }
                );
            } else {
                StaffFoundEmbed2 = StaffFoundEmbed2.addField(
                    `<a:diamante:650792674248359936> **${m.server_name}** <a:diamante:650792674248359936>`,
                    '\u200B'
                );

                StaffFoundEmbed2 = StaffFoundEmbed2.addFields(
                    { name: `\u200B`, value: `**set**`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    {
                        name: `\u200B`,
                        value: `\`\`\`${`"${m.steamid}"  "@${m.cargo}" //${
                            m.isVip == 0
                                ? `${m.name}  (${m.discord_id})`
                                : `${m.name} (${m.date_create} - ${m.discord_id} - ${m.date_final})`
                        }`}\`\`\``,
                        inline: true,
                    }
                );
            }
        });

        interaction.reply({content: '**Te enviei os cargos desse staff no seu PV**'}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        await interaction.user.send({embeds: [StaffFoundEmbed]});
        if (StaffFoundEmbed2.fields != '') {
            await interaction.user.send({embeds: [StaffFoundEmbed2]});
        }
    },
};
