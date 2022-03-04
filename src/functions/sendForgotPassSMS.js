const smsrequest = require('@services/smsService');
const template = require('@templates/smsMessageTemplate');

async function send(phone, token) {
    try {
        const result = await smsrequest.sendSMS(
            parseInt(phone, 10),
            template.smsTemplate(token),
        );
        if (!result.data) {
            if (result.sucesso === true) {
                return true;
            }
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { send };
