function smsTemplate(token) {
    return `${'Here is your code to AlphaShop:'
      + '\n'}${
        token
    }                                    `
      + 'Use your code at: '
      + '/recover'; // sms message
}

module.exports = { smsTemplate };
