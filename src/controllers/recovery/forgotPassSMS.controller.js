// -----------------------------------------------------------------------------------------------//
// Archive: controllers/recovery/forgotPassSMS.controller.js
// Description: File responsible for the 'forgotPassSMS' function of the 'recovery' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');
const smsrequest = require('@functions/sendForgotPassSMS');
const crypto = require('crypto');

exports.forgotPassSMS = async (req, res) => {
    console.log(req.body);
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { phone } = req.body;
    const token = crypto.randomBytes(20).toString('hex');

    const checkSelect = ['phone'];
    const whereCheck = {
        phone: {
            operator: '=',
            value: parseInt(phone, 10),
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
                const smsresult = await smsrequest.send(phone, token);
                if (smsresult === true) {
                    const expire = new Date();
                    expire.setHours(expire.getHours() + 2);
                    const fieldvalues = {};
                    fieldvalues.recover_token = {
                        value: token,
                        type: 'string',
                    };
                    fieldvalues.rtoken_expire = {
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
                    res.status(201).send({ message: 'SMS enviado' });
                } else {
                    res.sendError(smsresult, 500);
                }
            } catch (err) {
                errors.criticalErrors.errorCategory = {
                    message: 'Ocorreu um erro inesperado.',
                    code: 500,
                    detail: { ...err },
                };
                res.sendError(errors, 500);
            }
        } else {
            errors.criticalErrors.documentphone = {
                message: 'Telefone não encontrado ou conta não ativada',
                code: 404,
            };
            res.sendError(errors, 404);
        }
    } else {
        errors.criticalErrors.errorCategory = {
            message: 'Ocorreu um erro inesperado.',
            code: 500,
            detail: { ...result.data },
        };
        res.sendError(errors, 500);
    }
};
