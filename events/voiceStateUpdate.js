module.exports = {
    name: 'voiceStateUpdate',
    once: 'on',
    async execute(oldMember, newMember, client) {
        const channel = client.channels.cache.get(oldMember.channelId);
        if (channel == undefined) return;
        
        if (channel.parentId == '840826127999565894') {
            if (channel.members.map((a) => a.id) == '') {
                client.channels.cache
                    .get('840936627839828068')
                    .messages.fetch()
                    .then((m) => {
                        let ChannelFind = m.find((c) => c.content.includes(oldMember.channelId));
                        ChannelFind.delete();
                        channel.delete();
                    });
            }
        }
    },
};
