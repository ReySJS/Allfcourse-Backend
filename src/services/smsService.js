require('dotenv').config();
const totalvoice = require('totalvoice-node');

const client = new totalvoice(process.env.SMS_KEY);

async function sendSMS(number, message, user_response = false, multi_sms = false, create_date = '') {
    const result = await client.sms.enviar(number, message, user_response, multi_sms, create_date);
    console.log(result);
    return result;
}

module.exports = { sendSMS };
