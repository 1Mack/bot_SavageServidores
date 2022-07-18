module.exports = {
  name: 'voiceStateUpdate',
  once: 'on',
  async execute(oldMember, newMember, client) {

    const channel = client.channels.cache.get(oldMember.channelId);
    if (channel == undefined) return;

    if (channel.parentId == '936310042225934408') {
      if (channel.members.map((a) => a.id) == '') {
        client.channels.cache
          .get('840936627839828068')
          .messages.fetch()
          .then((m) => {
            let channelFind = m.find((c) => c.content.includes(oldMember.channelId));
            channelFind.delete();
            channel.delete();

          });
      }
    }
  },
};
