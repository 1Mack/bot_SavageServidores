const { storePanelToken } = require('../../../configs/config_privateInfos');
const axios = require('axios').default;

class API {

  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.five-m.store/api/' + token
    })
  }

  packages = async () => {
    try {
      return (await this.api.get('/packages')).data
    } catch (error) {
      return;
    }
  }
  delivery = async (ids) => {
    try {
      return (await this.api.get('/delivery?ids=' + ids.join(','))).data
    } catch (error) {
      return;
    }
  }
}

module.exports = new API(storePanelToken.token);