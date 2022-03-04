/* eslint-disable no-unused-vars */
const query = require('@helpers/Query');
const validateNewPass = require('@validations/validateNewPass');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function check(token, newpass, confirmnewpass) {
    // const errors = [];
    const errors = { criticalErrors: {}, validationErrors: {} };
    const validtoken = validateNewPass.validateToken(token, errors.validationErrors);
    const validpass = validateNewPass.validatePassword(newpass, confirmnewpass, errors.validationErrors);
    if (Object.keys(errors.validationErrors).length > 0) {
        return errors;
    }

    let now = new Date();
    const now_converted = now.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
    });
    now = now_converted;

    const checkSelect1 = ['recover_token', 'rtoken_expire'];
    const whereCheck1 = {
        recover_token: {
            operator: '=',
            value: token,
        },
    };
    const check1 = await query.Select('users', checkSelect1, whereCheck1, ['']);

    if (check1.data.length >= 1) {
        const expire = new Date(check1.data[0].rtoken_expire);
        if (new Date(now_converted).getTime() < new Date(expire).getTime()) {
            const encryptedNewPassword = await bcrypt.hash(newpass, 10);
            const whereColumns = {
                recover_token: {
                    operator: '=',
                    value: token,
                },
            };
            const fieldsValue = {};
            fieldsValue.recover_token = {
                value: null,
                type: 'integer',
            };
            fieldsValue.rtoken_expire = {
                value: null,
                type: 'integer',
            };
            fieldsValue.password = {
                value: encryptedNewPassword,
                type: 'string',
            };
            const teste = await query.Update(true, 'users', fieldsValue, ['*'], whereColumns, ['']);
            console.log(teste);
            return true;
        }
        errors.criticalErrors.tokenExpired = {
            message: 'Token expirado',
            code: 400,
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
