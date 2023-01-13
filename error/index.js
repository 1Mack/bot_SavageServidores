exports.HandleError = function (client, err, msg) {
  if (err.message.includes("time")) return;
  client.guilds.cache.get('792575394271592458').channels.cache.get('843580489800745011').send(msg ? `${msg}\n\n${err.message}` : `${err.message}`)
  console.log(err)
}