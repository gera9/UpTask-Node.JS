const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const html2text = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password
    }
});

// Generate HTML
const generateHTML = (file, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${file}.pug`, options);
    return juice(html);
};

exports.send = async (options) => {
    const html = generateHTML(options.file, options);
    const text = html2text.fromString(html);
    
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: options.user.email,
        subject: options.subject,
        text: text,
        html: html
    };

    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, mailOptions);
};
