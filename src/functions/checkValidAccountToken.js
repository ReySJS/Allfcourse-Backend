const query = require('@helpers/Query');
require('dotenv').config();

async function check(token) {
    const errors = { criticalErrors: {}, validationErrors: {} };
    let now = new Date();
    const now_converted = now.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
    });
    now = now_converted;

    const checkSelect1 = ['email_token', 'etoken_expire'];
    const whereCheck1 = {
        email_token: {
            operator: '=',
            value: token,
        },
    };
    const check1 = await query.Select('users', checkSelect1, whereCheck1, ['']);
    if (check1.data.length >= 1) {
        const expire = new Date(check1.data[0].etoken_expire);

        if (new Date(now_converted).getTime() < new Date(expire).getTime()) {
            const whereColumns = {
                email_token: {
                    operator: '=',
                    value: token,
                },
            };
            const fieldsValue = {};
            fieldsValue.active = {
                value: true,
                type: 'integer',
            };
            fieldsValue.email_token = {
                value: null,
                type: 'integer',
            };
            fieldsValue.etoken_expire = {
                value: null,
                type: 'integer',
            };
            await query.Update(true, 'users', fieldsValue, ['*'], whereColumns, ['']);
            return true;
        }
        errors.criticalErrors.expiredToken = {
            message: 'Token expirado',
            code: 500,
        };
        return errors;
    }
    errors.criticalErrors.invalidToken = {
        message: 'Token Inválido',
        code: 404,
    };
    return errors;
}

module.exports = { check };
