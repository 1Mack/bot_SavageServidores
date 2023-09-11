const moment = require('moment');
moment.locale('en-gb')
exports.EmailPackagesSent = function (sale) {
  return `
  <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Pedido Recebido</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <style type="text/css">
    .rollover:hover .rollover-first {
      max-height: 0px !important;
      display: none !important;
    }

    .rollover:hover .rollover-second {
      max-height: none !important;
      display: inline-block !important;
    }

    .rollover div {
      font-size: 0px;
    }

    u~div img+div>div {
      display: none;
    }

    #outlook a {
      padding: 0;
    }

    span.MsoHyperlink,
    span.MsoHyperlinkFollowed {
      color: inherit;
      mso-style-priority: 99;
    }

    a.es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    .es-header-body a:hover {
      color: #926B4A !important;
    }

    .es-content-body a:hover {
      color: #926B4A !important;
    }

    .es-footer-body a:hover {
      color: #926B4A !important;
    }

    .es-infoblock a:hover {
      color: #cccccc !important;
    }

    .es-button-border:hover>a.es-button {
      color: #ffffff !important;
    }

    @media only screen and (max-width:600px) {
      .es-m-p10 {
        padding: 10px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0px !important
      }

      .es-m-p10r {
        padding-right: 10px !important
      }

      .es-m-p10l {
        padding-left: 10px !important
      }

      .es-m-p10r {
        padding-right: 10px !important
      }

      .es-m-p10l {
        padding-left: 10px !important
      }

      *[class="gmail-fix"] {
        display: none !important
      }

      p,
      a {
        line-height: 150% !important
      }

      h1,
      h1 a {
        line-height: 120% !important
      }

      h2,
      h2 a {
        line-height: 120% !important
      }

      h3,
      h3 a {
        line-height: 120% !important
      }

      h4,
      h4 a {
        line-height: 120% !important
      }

      h5,
      h5 a {
        line-height: 120% !important
      }

      h6,
      h6 a {
        line-height: 120% !important
      }

      .es-header-body p {}

      .es-content-body p {}

      .es-footer-body p {}

      .es-infoblock p {}

      h1 {
        font-size: 30px !important;
        text-align: center
      }

      h2 {
        font-size: 26px !important;
        text-align: center
      }

      h3 {
        font-size: 20px !important;
        text-align: center
      }

      h4 {
        font-size: 24px !important;
        text-align: left
      }

      h5 {
        font-size: 20px !important;
        text-align: left
      }

      h6 {
        font-size: 16px !important;
        text-align: left
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 30px !important
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 26px !important
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important
      }

      .es-header-body h4 a,
      .es-content-body h4 a,
      .es-footer-body h4 a {
        font-size: 24px !important
      }

      .es-header-body h5 a,
      .es-content-body h5 a,
      .es-footer-body h5 a {
        font-size: 20px !important
      }

      .es-header-body h6 a,
      .es-content-body h6 a,
      .es-footer-body h6 a {
        font-size: 16px !important
      }

      .es-menu td a {
        font-size: 12px !important
      }

      .es-header-body p,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body a {
        font-size: 14px !important
      }

      .es-infoblock p,
      .es-infoblock a {
        font-size: 12px !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3,
      .es-m-txt-c h4,
      .es-m-txt-c h5,
      .es-m-txt-c h6 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3,
      .es-m-txt-r h4,
      .es-m-txt-r h5,
      .es-m-txt-r h6 {
        text-align: right !important
      }

      .es-m-txt-j,
      .es-m-txt-j h1,
      .es-m-txt-j h2,
      .es-m-txt-j h3,
      .es-m-txt-j h4,
      .es-m-txt-j h5,
      .es-m-txt-j h6 {
        text-align: justify !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3,
      .es-m-txt-l h4,
      .es-m-txt-l h5,
      .es-m-txt-l h6 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img,
      .es-m-txt-r .rollover:hover .rollover-second,
      .es-m-txt-c .rollover:hover .rollover-second,
      .es-m-txt-l .rollover:hover .rollover-second {
        display: inline !important
      }

      .es-m-txt-r .rollover div,
      .es-m-txt-c .rollover div,
      .es-m-txt-l .rollover div {
        line-height: 0 !important;
        font-size: 0 !important
      }

      .es-spacer {
        display: inline-table
      }

      a.es-button,
      button.es-button {
        font-size: 20px !important
      }

      .es-m-fw,
      .es-m-fw.es-fw,
      .es-m-fw .es-button {
        display: block !important
      }

      .es-m-il,
      .es-m-il .es-button,
      .es-social,
      .es-social td,
      .es-menu {
        display: inline-block !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      .es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 1% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      .es-social td {
        padding-bottom: 10px
      }

      .h-auto {
        height: auto !important
      }

      a.es-button,
      button.es-button {
        display: inline-block !important
      }

      .es-button-border {
        display: inline-block !important
      }
    }
  </style>
</head>

<body style="width:100%;height:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#FFFFFF"><!--[if gte mso 9]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
<v:fill type="tile" color="#ffffff"></v:fill>
</v:background>
<![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
      <tr>
        <td valign="top" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" class="es-header" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img"
                                    src="https://www.savageservidores.com/images/S_Logo2.png" alt="" width="255"
                                    style="display:block;font-size:14px;border:0;outline:none;text-decoration:none">
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <h1
                                    style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:30px;font-style:normal;font-weight:bold;line-height:36px;color:#333333">
                                    Atualizações sobre seu Pedido!</h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td class="esdev-adapt-off es-m-p10" align="left"
                      background="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/66551620375036465.png"
                      style="padding:20px;Margin:0;background-image:url(https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/66551620375036465.png);background-repeat:no-repeat;background-position:center center">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:177px">
                                  <table cellpadding="0" cellspacing="0" width="100%"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#f6e6cb"
                                    bgcolor="#f6e6cb" role="presentation">
                                    <tr>
                                      <td align="center"
                                        style="padding:0;Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;font-size:0px">
                                        <a target="_blank" href="https://viewstripo.email"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#926B4A;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/60121620374838489.png"
                                            alt=""
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                            width="30"></a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center"
                                        style="Margin:0;padding-top:5px;padding-right:10px;padding-bottom:10px;padding-left:10px">
                                        <p
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          Pedido Efetuado<br>${moment(sale.created_at).local().format('DD-MM-YYYY HH:mm:ss')}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:15px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:177px">
                                  <table cellpadding="0" cellspacing="0" width="100%"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#f6e6cb"
                                    bgcolor="#f6e6cb" role="presentation">
                                    <tr>
                                      <td align="center"
                                        style="padding:0;Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;font-size:0px">
                                        <a target="_blank" href="https://viewstripo.email"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#926B4A;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/60121620374838489.png"
                                            alt=""
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                            width="30"></a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center"
                                        style="Margin:0;padding-top:5px;padding-right:10px;padding-bottom:10px;padding-left:10px">
                                        <p
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          Pagamento Confirmado<br>${moment(sale.updated_at).local().format('DD-MM-YYYY HH:mm:ss')}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:15px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:177px">
                                  <table cellpadding="0" cellspacing="0" width="100%"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#f6e6cb"
                                    bgcolor="#f6e6cb" role="presentation">
                                    <tr>
                                      <td align="center"
                                        style="padding:0;Margin:0;padding-top:10px;padding-right:15px;padding-left:15px;font-size:0px">
                                        <a target="_blank" href="https://viewstripo.email"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#926B4A;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/60121620374838489.png"
                                            alt=""
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                            width="30"></a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center"
                                        style="Margin:0;padding-top:5px;padding-right:10px;padding-bottom:10px;padding-left:10px">
                                        <p
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          Enviado${sale.packages.find(m => m.status == 'Erro') ? ' com restrições' : ''}<br>${moment().local().format('DD-MM-YYYY HH:mm:ss')}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0"><span class="es-button-border"
                                    style="border-style:solid;border-color:#2CB543;background:#666666;border-width:0px;display:inline-block;border-radius:30px;width:auto"><a
                                      href="https://loja.savageservidores.com/order/${sale.internal_id}" class="es-button" target="_blank"
                                      style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#666666;border-radius:30px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #666666">Acompanhar
                                      Pedido</a></span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#a0937d;font-size:14px">
                                    ITEMS COMPRADOS PARA A STEAMID <b>${sale.client_identifier}</b></p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${sale.packages.map(m => {
    return (`
                    <tr>
                    <td class="esdev-adapt-off" align="left"
                      style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:125px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                          href="https://loja.savageservidores.com"
                                          style="mso-line-height-rule:exactly;text-decoration:underline;color:#926B4A;font-size:14px"><img
                                            class="adapt-img p_image"
                                            src="${m.meta.image}"
                                            alt="Marshall Monitor"
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                            width="125" title="Marshall Monitor"></a></td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:1505px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="left" class="es-m-p0t es-m-p0b es-m-txt-l"
                                        style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                        <h3
                                          style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:17px;font-style:normal;font-weight:bold;line-height:24px;color:#333333">
                                          <strong class="p_name">${m.name}</strong>
                                        </h3>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:176px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" class="es-m-p0t es-m-p0b"
                                        style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px"
                                          class="p_description">${m.status == 'Error' ? 'Erro ao Enviar' : 'Enviado'}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:74px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" class="es-m-p0t es-m-p0b"
                                        style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                        <p class="p_price"
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          ${m.meta.price_display}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`)
  })}
                  
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="esdev-adapt-off" align="left"
                      style="padding:0;Margin:0;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:466px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" style="padding:0;Margin:0">
                                        <p
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          <b>Total (${sale.packages.length})</b>
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;width:200px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="right" style="padding:0;Margin:0">
                                        <p
                                          style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                          <strong>${sale.price_display} (Com taxas)</strong>
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;display:none"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:30px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:1px solid #999999;background:none;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:10px">
                                  <h2
                                    style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:24px;font-style:normal;font-weight:bold;line-height:29px;color:#333333">
                                    <b>Alguma Dúvida?</b>
                                  </h2>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#666666;font-size:14px">
                                    Acesse nosso canal de suporte</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="es-m-p10l es-m-p10r" align="left"
                      style="padding:0;Margin:0;padding-bottom:20px;padding-right:100px;padding-left:100px">
                      <table cellpadding="0" cellspacing="0" align="right" class="es-right"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:390px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span
                                    class="es-button-border"
                                    style="border-style:solid;border-color:#2CB543;background:#666666;border-width:0px;display:block;border-radius:30px;width:auto"><a
                                      href="https://discord.savageservidores.com" class="es-button" target="_blank"
                                      style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:block;background:#666666;border-radius:30px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #666666;border-left-width:20px;border-right-width:20px">SUPORTE</a></span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
            <tr>
              <td align="center" bgcolor="#fef8ed" style="padding:0;Margin:0;background-color:#fef8ed">
                <table bgcolor="#fef8ed" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fef8ed;width:600px">
                  <tr>
                    <td class="es-m-p10r es-m-p10l" align="left"
                      style="Margin:0;padding-right:20px;padding-left:20px;padding-top:15px;padding-bottom:15px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td style="padding:0;Margin:0">
                                  <table cellpadding="0" cellspacing="0" width="100%" class="es-menu"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr class="links-images-left">
                                      <td align="center" valign="top" width="33.33%" id="esd-menu-id-0"
                                        style="Margin:0;border:0;padding-top:10px;padding-bottom:10px;padding-right:5px;padding-left:5px">
                                        <a target="_blank" href="https://savageservidores.com"
                                          style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#a0937d;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/58991620296762845.png"
                                            alt="SITE" title="SITE" align="absmiddle" width="25"
                                            style="display:inline !important;font-size:14px;border:0;outline:none;text-decoration:none;vertical-align:middle;padding-right:15px">SITE</a>
                                      </td>
                                      <td align="center" valign="top" width="33.33%"
                                        style="Margin:0;border:0;padding-top:10px;padding-bottom:10px;padding-right:5px;padding-left:5px;border-left:1px solid #a0937d"
                                        id="esd-menu-id-1"><a target="_blank" href="https://discord.savageservidores.com"
                                          style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#a0937d;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/55781620296763104.png"
                                            alt="DISCORD" title="DISCORD" align="absmiddle" width="25"
                                            style="display:inline !important;font-size:14px;border:0;outline:none;text-decoration:none;vertical-align:middle;padding-right:15px">DISCORD</a>
                                      </td>
                                      <td align="center" valign="top" width="33.33%"
                                        style="Margin:0;border:0;padding-top:10px;padding-bottom:10px;padding-right:5px;padding-left:5px;border-left:1px solid #a0937d"
                                        id="esd-menu-id-2"><a target="_blank" href="https://loja.savageservidores.com"
                                          style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#a0937d;font-size:14px"><img
                                            src="https://xphfzz.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/88291620296763036.png"
                                            alt="LOJA" title="LOJA" align="absmiddle" width="25"
                                            style="display:inline !important;font-size:14px;border:0;outline:none;text-decoration:none;vertical-align:middle;padding-right:15px">LOJA</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-footer" align="center"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:#E3CDC1;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" bgcolor="#ffffff" style="padding:0;Margin:0;background-color:#ffffff">
                <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-right:20px;padding-left:20px;padding-top:30px;padding-bottom:30px">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                  <p
                                    style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#666666;font-size:12px">
                                    Você está recebendo esse e-mail pois realizou uma compra em nosso site. Tenha
                                    certeza de que nossos e-mails estejam indo para sua caixa principal (e não para a
                                    lixeira ou spam).</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" width="100%"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" class="es-infoblock made_with"
                                  style="padding:0;Margin:0;font-size:0"><a target="_blank"
                                    href="https://savageservidores.com"
                                    style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"><img
                                      src="https://www.savageservidores.com/images/S_Logo2.png" alt=""
                                      style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"
                                      width="145"></a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
  `
}