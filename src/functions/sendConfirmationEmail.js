const emailservice = require('@services/emailService');
const template = require('@templates/confirmationEmailTemplate');

async function send(email, name, token) {
    const mailOptions = {
        to: `${email}`,
        subject: 'Seu código de confirmação para o AllfCourse',
        html: template.confirmationTemplate(token, name),
    };

    try {
        const result = await emailservice.sendEmail(mailOptions);
        return result;
    } catch (err) {
        return err;
    }
}

module.exports = { send };
