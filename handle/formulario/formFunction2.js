const { connection } = require('../../configs/config_privateInfos');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { FormserverChoose } = require('./embed');
const {serversInfos} = require('../../configs/config_geral')
async function formFunction2(user, channel, client, msg, resultForm1Check) {
    let result
    
    if(!msg){
        msg = await channel.send('refresh')
    }
    const con = connection.promise();

    async function DeleteRecords() {
        await con.query(`delete from form_respostas where discord_id = '${user.id}'`);
        await con.query(`delete from form_respostas_2Etapa where discord_id = '${user.id}'`);
    }

    let embed = new Discord.MessageEmbed()
        .setTitle('Segunda Etapa - Perguntas Gerais')
        .setColor('36393f')
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png');

    if (resultForm1Check !== undefined && resultForm1Check !== 'ChooseServer') {
        [result] = await con.query(
            `select * from form_messages_2Etapa where message_id > ${resultForm1Check.message_id} AND 
                servidor in (select server_choosen from form_respostas_2Etapa where server_choosen = "${resultForm1Check.server_choosen}")`
        );

        if (resultForm1Check.server_choosen == 'geral') {
            if (result == '') {
                return formFirstPart();
            }
        } else {
            return formSecondPart(result[0]);
        }
    }else if(resultForm1Check == 'ChooseServer'){
        return formFirstPart()
    } else {
        [result] = await con.query('select * from form_messages_2Etapa where servidor = "geral"');
    }

    for (let i in result) {

        embed = embed.setDescription(`__Pergunta Número ${result[i].message_id}__

                > ***${result[i].message_question}***
                
                
                Você tem 3 minutos para responder a essa pergunta!`);

            msg.edit({embeds: [embed]});

        const filter = (m) => m.author.bot == false && m.author == user;

        await channel
            .awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
            .then(async (collected) => {
                collected = await collected.first()
                
                collected.delete()

                let values = [[`${user.id}`, result[i].message_id, collected.content, 'geral']];
                try {
                    await con.query(
                        `INSERT INTO form_respostas_2Etapa(discord_id, message_id, awnser, server_choosen) VALUES ?`,
                        [values]
                    );
                } catch (error) {
                    return (
                        msg.edit(`${user} **| Houve um erro ao registrar sua resposta....Deletando Canal**`),
                        console.log(error),
                        setTimeout(async function () {
                            await DeleteRecords(), channel.delete();
                        }, 5000)
                    );
                }
            })
            .catch(async () => {
                return (
                    await msg.edit(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                    await wait(5000),
                    await DeleteRecords(), 
                    await channel.delete()
                );
            });
    }

    await formFirstPart();

    async function formFirstPart() {
        
        let [resultCheck] = await con.query(`select discord_id, server_choosen from form_respostas_2Etapa where discord_id = "${user.id}"`)
        let resultServerFind = []
        
      for(let index in serversInfos){
        if(!resultCheck.find(m => m.server_choosen == serversInfos[index].name)){
            resultServerFind.push(serversInfos[index].name)
        }
      }
      resultServerFind = serversInfos.filter(m => resultServerFind.includes(m.name))

        msg.edit({embeds: [FormserverChoose(user, embed, resultServerFind).embed], components: [FormserverChoose(user, embed, resultServerFind).lista]});

        const filter = i => {
            i.deferUpdate();
            return i.user.id == user.id && i.channelId == channel.id;
        };

        await channel
            .awaitMessageComponent({ filter, time: 300000, errors: ['time'] })
            .then(async (collected) => {

            formSecondPart(collected.values[0]);
               
            })
            .catch(async (err) => {
                return (
                    await msg.edit({content:
                        `${user} **| Voce não respondeu a tempo, abortando formulário <a:loading44:650850501742821395>!!!!\`**`
                    , components: []}),
                   await wait(5000),
                    DeleteRecords(),
                    channel.delete()
                    
                );
            });
    }
    async function formSecondPart(serverescolhido) {
        if (serverescolhido.message_id) {
            [result] = await con.query(
                `select * from form_messages_2Etapa where servidor = "${serverescolhido.servidor}" and message_id >= "${serverescolhido.message_id}"`
            );
        } else {
            [result] = await con.query(`select * from form_messages_2Etapa where servidor = "${serverescolhido}"`);
        }

        embed = embed.setTitle(`Segunda Etapa - Perguntas ${result[0].servidor.toUpperCase()}`);
        for (let i in result) {
            

            embed = embed.setDescription(`__Pergunta Número ${10 + parseInt(i)}__
        
                        > ***${result[i].message_question}***
                        
                        
                        Você tem 3 minutos para responder a essa pergunta!`);

            await msg.edit({embeds: [embed], components: []});

            const filter = (m) => m.author.bot == false && m.author == user;
            await channel
                .awaitMessages({filter, max: 1, time: 300000, errors: ['time'] })
                .then(async (collected) => {

                    collected = await collected.first()
                    collected.delete()

                    let values = [
                        [
                            `${user.id}`,
                            result[i].message_id,
                            collected.content,
                            `${result[i].servidor}`,
                        ],
                    ];
                    try {
                        await con.query(
                            `INSERT INTO form_respostas_2Etapa(discord_id, message_id, awnser, server_choosen) VALUES ?`,
                            [values]
                        );
                    } catch (error) {
                        return (
                            await msg.edit(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                            await wait(5000),
                            DeleteRecords(), 
                            channel.delete()
                            
                        );
                    }
                })
                .catch(async () => {
                    return (
                        await msg.edit(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                        await wait(5000),
                        DeleteRecords(), 
                        channel.delete()
                    );
                });
        }
        

        let guild = client.guilds.cache.get('792575394271592458');
        const canal = await guild.channels.cache.find(
            (channel) => channel.name == result[0].servidor && channel.parentId == '839343718016614411'
        );

        const logFormDone = new Discord.MessageEmbed()
            .setColor('36393f')
            .setTitle(`***${user.username}***`)
            .setDescription(
                `
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

        **DISCORD_ID:**  ${user.id}
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        `
            )
            .setFooter('Formulário feito')
            .setTimestamp();

        canal.send({embeds: [logFormDone]});

        embed.setTitle(`***Formulário Preenchido com sucesso!***`);
        embed.setDescription(`
                > **Suas respostas foram computadas no meu sistema com sucesso!**
                > **O resultado sairá __até dia 1__**
                > **Você será avisado no seu privado sobre o resultado!**`);
        await msg.edit({embeds: [embed]});

        await wait(15000)
        channel.delete();
        con.query(`DELETE FROM form_respostas WHERE discord_id ='${user.id}'`);
        
    }
}

module.exports = {
    formFunction2,
};
