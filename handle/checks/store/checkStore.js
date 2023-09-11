const api = require("./api");
const { ProcessSale } = require("./handle/processSale");

exports.RunStore = async function (client) {

  const packages = await api.packages()

  if (!packages) return;

  for (let pkg of packages) {
    await ProcessSale(pkg, client)
    await api.delivery(pkg.packages.map(m => m.commands.id).concat(pkg.userNotifyId));
  }

}
