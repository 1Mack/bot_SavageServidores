const { storePanelToken } = require('../../../configs/config_privateInfos');
const axios = require('axios').default;

class API {

  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.centralcart.com.br/api/application',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  packages = async () => {
    try {
      let { data: commandsInfos } = await this.api.get('/queued_commands')
      if (commandsInfos.length == 0) return;
      let commandsInfosFormatted = []
      commandsInfos.map(m => {
        let findDataFormatted = commandsInfosFormatted.length > 0 ? commandsInfosFormatted.findIndex(df => df.internal_id == m.order.internal_id) : -1

        if (findDataFormatted == -1) {
          if (!m.command.startsWith('userNotify')) {
            commandsInfosFormatted.push({ internal_id: m.order.internal_id, data: [{ id: m.id, command: JSON.parse(m.command) }] })
          } else {
            commandsInfosFormatted.push({ internal_id: m.order.internal_id, data: [{ id: m.id }] })
          }
        } else {
          if (!m.command.startsWith('userNotify')) {
            commandsInfosFormatted[findDataFormatted].data.push({ id: m.id, command: JSON.parse(m.command) })
          } else {
            commandsInfosFormatted[findDataFormatted].data.push({ id: m.id })
          }
        }

      })

      return await Promise.all(commandsInfosFormatted.map(async command => {
        let { data } = await this.api.get(`/order/${command.internal_id}`)
        data.packages.map(m => {
          let findCommand = command.data.find(cmd => cmd.plano == m.plano)
          m.commands = findCommand
        })
        let findUserNotifyId = command.data.find(cmd => !cmd['command'])

        data.userNotifyId = findUserNotifyId ? findUserNotifyId.id : undefined
        return data
      }))

    } catch (error) {
      return { erorr: error };
    }
  }
  delivery = async (ids) => {
    try {
      return await ids.forEach(async id => {
        if (!id) return;
        await this.api.patch(`/command/${id}`,
          new URLSearchParams({
            status: "DONE",
            response: "Produto entregue"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
          })
      })
    } catch (error) {
      return;
    }
  }
}

module.exports = new API(storePanelToken.token);