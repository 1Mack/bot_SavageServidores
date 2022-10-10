const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client(
  {
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
  }
);
const fs = require('fs');
const { botConfig } = require('./configs/config_privateInfos');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { RunStore } = require('./handle/checks/store/checkStore');
const { guildsInfo } = require('./configs/config_geral');

const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

client.commands = new Collection();
client.cooldowns = new Collection();

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js') && file.startsWith('p_'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);

    client.commands.set(command.name, command)

  }

}
for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once == 'once') {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

process.on('unhandledRejection', (err) => {
  if (
    !err.message.includes('Unknown Channel') &&
    !err.message.includes('Unknown Message') &&
    !err.message.includes('Cannot send messages to this user') &&
    !err.message.includes('Collector received no interactions before ending with reason: time')
  ) {
    console.error(err);
  }
});


const rest = new REST({ version: '9' }).setToken(botConfig.token);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(botConfig.applicationId, guildsInfo.main),
      { body: client.commands },
    )

    console.log('COMANDOS (/) FORAM ATUALIZADOS!');
  } catch (error) {
    console.error(error);
  }
})();

RunStore()

client.login(botConfig.token);
