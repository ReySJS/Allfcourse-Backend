const emailservice = require('@services/emailService');
const template = require('@templates/forgotPassEmailTemplate');

async function send(email, name, token) {
    const mailOptions = {
        to: `${email}`,
        subject: 'Seu código de nova senha para o AlffCourse',
        html: template.forgotTemplate(token, null, null, null, null, name),
    };

    try {
        const result = await emailservice.sendEmail(mailOptions);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = { send };
