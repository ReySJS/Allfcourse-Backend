// -----------------------------------------------------------------------------------------------//
// Archive: controllers/recovery/newEmailToken.controller.js
// Description: File responsible for the 'newEmailToken' function of the 'recovery' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
require('dotenv').config();

const emailrequest = require('@functions/sendConfirmationEmail');
const crypto = require('crypto');

exports.newEmailToken = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expire = new Date();
    expire.setHours(expire.getHours() + 2);
    try {
        const checkSelect = ['email', 'first_name'];
        const whereCheck = {
            email: {
                operator: '=',
                value: email,
            },
            deleted_at: {
                operator: 'is',
                value: null,
            },
        };
        const checkOperators = ['AND'];
        const check = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            checkOperators,
        );
        if (Array.isArray(check.data)) {
            if (check.data.length >= 1) {
                const fieldvalues = {};
                fieldvalues.email_token = {
                    value: token,
                    type: 'string',
                };
                fieldvalues.etoken_expire = {
                    value: expire,
                    type: 'string',
                };
                await query.Update(
                    true,
                    'users',
                    fieldvalues,
                    ['*'],
                    whereCheck,
                    checkOperators,
                );
                await emailrequest.send(
                    email,
                    check.data[0].first_name,
                    token,
                );
                res.status(201).send({ message: 'Novo token gerado e e-mail enviado' });
            } else {
                errors.criticalErrors.email = {
                    message: 'Email não encontrado',
                    code: 404,
                };
                res.sendError(errors, 404);
            }
        }
    } catch (err) {
        errors.criticalErrors.errorCategory = {
            message: 'Ocorreu um erro inesperado.',
            code: 500,
            detail: { ...err },
        };
        res.sendError(errors, 500);
    }
};
