const mysql = require('mysql2');

const botConfig = {
  token: '',
  applicationId: ''
};

const panelApiKey = {
  api: '',
};

const connection = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
});

const connection2 = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  port: ''
});

const storePanelToken = {
  token: ''
}
module.exports = {
  botConfig,
  connection,
  connection2,
  panelApiKey,
  storePanelToken
};

