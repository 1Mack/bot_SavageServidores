const nodemailer = require('nodemailer');
const { EmailOrderReceived } = require('./html/orderReceived');
const { EmailPackagesSent } = require('./html/packagesSent');
const { EmailServerCreated } = require('./html/serverCreated');

exports.Email = class {

  constructor(sale) {
    this.transporter = nodemailer.createTransport({
      host: "",
      port: '',
      secure: true,
      auth: {
        user: '',
        pass: ''
      }
    });
    this.sale = sale
  }

  async orderReceived() {
    try {
      return await this.transporter.sendMail({
        from: '"Savage Servidores" <>',
        to: this.sale.client_email,
        subject: "Informações sobre seu Pedido",
        html: EmailOrderReceived(this.sale),
      });
    } catch (error) { }
  }
  async packaSent() {
    try {
      return await this.transporter.sendMail({
        from: '"Savage Servidores" <>',
        to: this.sale.client_email,
        subject: "Informações sobre seu Pedido",
        html: EmailPackagesSent(this.sale),
      });
    } catch (error) { }
  }
  async serverCreated(password) {
    try {
      return await this.transporter.sendMail({
        from: '"Savage Servidores" <>',
        to: this.sale.client_email,
        subject: "Informações sobre seu Pedido",
        html: EmailServerCreated(this.sale.client_email, password),
      });
    } catch (error) { console.log(error) }
  }
}