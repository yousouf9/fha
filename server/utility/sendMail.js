const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const config = require('config');
const winston = require('winston');



const hostConfig={
   host: config.get("mail.mailHost"),
   port: config.get("mail.mailPort"),
    auth: {
        user: config.get("mail.mailUsername"),
        pass: config.get("mail.mailPassword")
    }
}

const sendMail = (from, to, subject, html, callback)=>{


    var transporter = nodemailer.createTransport(hostConfig);

    transporter.use('compile', htmlToText());


    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
      };
      
     return transporter.sendMail(mailOptions, callback);

    }

    module.exports.sendMail = sendMail;