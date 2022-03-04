// -----------------------------------------------------------------------------------------------//
// Archive: controllers/recovery/forgotPassEmail.controller.js
// Description: File responsible for the 'forgotPassEmail' function of the 'recovery' class
//  controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');
const emailrequest = require('@functions/sendForgotPassEmail');
const crypto = require('crypto');

exports.forgotPassEmail = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const checkSelect = ['email', 'first_name'];
    const whereCheck = {
        email: {
            operator: '=',
            value: email,
        },
        active: {
            operator: '=',
            value: true,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const checkOperators = ['AND', 'AND'];
    const result = await query.Select(
        'users',
        checkSelect,
        whereCheck,
        checkOperators,
    );
    if (Array.isArray(result.data)) {
        if (result.data.length >= 1) {
            try {
                const expire = new Date();
                expire.setHours(expire.getHours() + 2);
                await emailrequest.send(
                    email,
                    result.data[0].first_name,
                    token,
                );
                const fieldvalues = {};
                fieldvalues.recover_token = {
                    value: token,
                    type: 'string',
                };
                fieldvalues.rtoken_expire = {
                    value: expire,
                    type: 'string',
                };
                const test = await query.Update(
                    true,
                    'users',
                    fieldvalues,
                    ['*'],
                    whereCheck,
                    checkOperators,
                );
                console.log(test);
                res.status(201).send({ message: 'Email enviado' });
            } catch (err) {
                console.log(err);
                errors.criticalErrors.errorCategory = {
                    message: 'Ocorreu um erro inesperado.',
                    code: 500,
                    detail: { ...err },
                };
                res.sendError(errors, 500);
            }
        } else {
            errors.criticalErrors.email = {
                message: 'Email não encontrado ou conta não ativada',
                code: 404,
            };
            res.sendError(errors, 404);
        }
    } else {
        console.log(result.data);
        errors.criticalErrors.errorCategory = {
            message: 'Ocorreu um erro inesperado.',
            code: 500,
            detail: { ...result.data },
        };
        res.sendError(errors, 500);
    }
};
