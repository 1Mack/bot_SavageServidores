const { storePanelToken } = require('../../../configs/config_privateInfos');
const axios = require('axios').default;

class API {

  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.five-m.store/api/' + token
    });
  }

  packages = async () => (await this.api.get('/packages')).data;
  refunds = async () => (await this.api.get('/refunds')).data;
  delivery = async (ids) => (await this.api.get('/delivery?ids=' + ids.join(','))).data
  punish = async (ids) => (await this.api.get('/punish?ids=' + ids.join(','))).data;

}

module.exports = new API(storePanelToken.token);