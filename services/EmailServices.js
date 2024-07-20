const { nodemailer } = require('../config/dependencies')
const config = require("../config/config.json")

class EmailServices{
    static sendEmailWithValidationCode(email, validationCode) {
        return new Promise((resolve, reject) => {
            // generate html
            let html = config['email-content'].html; // basic html
            html += `<p>${validationCode}</p>`
            // console.log(`html`);
            // console.log(html); // debug

            // 设置邮件内容
            let mailOptions = {
                from: config['email-sender'].auth.user, // 发件人地址
                to: email,                    // 收件人地址，从请求体中获取
                subject: config['email-content'].subject, // 主题
                html: html // HTML 内容
            };
            // console.log(`mailOptions`);
            // console.log(mailOptions);// debug

            // 发送邮件
            let transporter = nodemailer.createTransport( config['email-sender'] );
            // console.log(`transporter`);
            // console.log(transporter);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(new Error('send email failed: EmailServices.sendEmailWithValidationCode()'));
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve({ sended: true, info: info.response });
                }
            });
        });
    }
}

module.exports = EmailServices
