const { connection } = require('../../configs/config_privateInfos');
const wait = require('util').promisify(setTimeout);
const {MessageEmbed} = require('discord.js');
const {FormResultOptions} = require('./embed')
const { formFunction2 } = require('./formFunction2');

async function formFunction(user, bool, channel, msg, client) {
    let result, resultFalseCheck;
    const con = connection.promise();

    if (bool == false) {
        await channel.messages.fetch();
        await channel.bulkDelete(100);

        [result] = await con.query(
            `select discord_id, MAX(message_id) as message_id from form_respostas where discord_id = "${user.id}"`
        );

       let [result2] = await con.query(
            `select discord_id from form_respostas_2Etapa where discord_id = "${user.id}"`
        );

        if (result[0].message_id == null && result2 == '') {


            return (
                await channel
                    .send({content: 
                        `${user} **| Como você ainda não começou o form, esse canal será deletado!**\n**Dentro de 15 segundos eu irei excluir essa sala, após isso você poderá abrir outro form!!**`
                    }),
                    await wait(10000),
                    channel.delete()
            );
        }else if(result2 != ''){
            return formResult(true);
        }

        [resultFalseCheck] = await con.query(
            `select * from form_messages where message_id = ${result[0].message_id + 1}`
        );
        

        if (resultFalseCheck == '') {
            return formResult(true);
        }
    }

    [result] = await con.query(
        `select * from ${
            resultFalseCheck !== undefined
                ? `form_messages where message_id >= '${resultFalseCheck[0].message_id}'`
                : 'form_messages'
        }`
    );

    for (let i in result) {
 

     try {
        await msg.edit({content: ' ', embeds: [FormResultOptions(user, result[i], i).embed], components: [FormResultOptions(user, result[i], i).lista]});
    
    } catch (error) {
        
        msg = channel.send({content: ' ', embeds: [FormResultOptions(user, result[i], i).embed], components: [FormResultOptions(user, result[i], i).lista]})
    } 

        const filter = i => {
            i.deferUpdate();
            return i.user.id == user.id && i.channelId == channel.id;
        };

        await channel
            .awaitMessageComponent({ filter, time: 100000, errors: ['time'] })
            .then(async (collected) => {
                let values = [
                    [
                        user.id,
                        result[i].message_id,
                        result[i].message_right_option == collected.values[0].charAt(0) ? 1 : 0,
                    ],
                ];
                try {
                    await con.query(
                        `INSERT INTO form_respostas(discord_id, message_id, message_rightOrNot) VALUES ?`,
                        [values]
                    );
                } catch (error) {
                    return (
                        await msg.edit({content:
                                `${user} **| Não consegui registrar essa resposta, deletando canal!!!\`**`,
                            embeds:[], components: []}),
                        await wait(5000),
                        await con.query(`delete from form_respostas where discord_id = '${user.id}'`),
                        await channel.delete(),
                        console.log(error)
                    );
                }
            })

            .catch(async () => {
                return (
                    await msg.edit({content: `${user} **| Você não respondeu a tempo....Deletando Canal**`, embeds: [], components: []}),
                    await wait(8000),
                    await con.query(`delete from form_respostas where discord_id = '${user.id}'`), 
                    channel.delete()
                );
            });
    }
    

    async function formResult(bool) {
        
        if (bool) {
            [result] = await con.query(
                `select discord_id, server_choosen, MAX(message_id) as message_id from form_respostas_2Etapa where discord_id = "${user.id}" 
                group by message_id order by message_id DESC limit 1;`
            );
            if (result !== '') {
                
                return formFunction2(user, channel, client, msg, result[0]);//ver se vai passar o parametro MSG
            }
        }
        let embed2 = new MessageEmbed() 
        .setDescription(`> **Seu formulário foi registrado com sucesso** 😎
            > 
            > **⚠️ Aguarde enquanto eu checo se você passou para a próxima fase**`);
        try {

        await msg.edit({embeds: [embed2], components: []})
            
        } catch (error) {
            msg = channel.send({embeds: [embed2], components: []})
        }

        await wait(7000);

        [result] = await con.query(
            `select count(discord_id) as Total, sum(message_rightOrNot) as Acertadas, avg(message_rightOrNot) as Porcentagem from form_respostas 
            where discord_id = '${user.id}'`
        );


        embed2 = embed2.setThumbnail(
                'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
            )
        embed2 = embed2.setFooter(
                'Sistema de Formuário Exclusivo da Savage Servidores',
                'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
            );

        
        if (result[0].Porcentagem > 0.7) {
            embed2 = embed2.setColor('229D2D');
            embed2 = embed2.setTitle('Aprovado');
            embed2 = embed2.setDescription(`Parabéns ${user}

                        > Você foi **aprovado para a segunda etapa do formulário**
                        > Você acertou **${result[0].Acertadas}/${
                result[0].Total
            }** perguntas, com uma eficiência de **${(result[0].Porcentagem * 100).toFixed()}%**
                        > 
                        > A segunda etapa começará dentro de **10 segundos**, aguarde...`);

            await msg.edit({embeds: [embed2]})
            await wait(10000)
            
            formFunction2(user, channel, client, msg);
        } else {
            embed2 = embed2.setColor('B30B0B');
            embed2 = embed2.setTitle('Reprovado');
            embed2 = embed2.setDescription(`Que pena ${user}

                        > Você foi reprovado!
                        > Você acertou **${result[0].Acertadas}/${
                result[0].Total
            }** perguntas, com uma eficiência de **${(
                result[0].Porcentagem * 100
            ).toFixed()}%**, sendo que o mínimo para passar era **70%**
                        > Você poderá fazer o formulário novamente daqui 1 semana`);

            await msg.edit({embeds: [embed2]});
            await con.query(`DELETE FROM form_respostas WHERE discord_id ='${user.id}'`);
            await wait(15000)
            channel.delete();
            
        }
    }
    formResult();
}

module.exports = {
    formFunction,
};
