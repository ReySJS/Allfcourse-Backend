// -----------------------------------------------------------------------------------------------//
// Archive: controllers/recovery/checkResetPassToken.controller.js
// Description: File responsible for the 'resetPass' function of the 'recovery' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const newusertoken = require('@functions/checkResetPassTokenOnly');

exports.checkpassToken = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { token } = req.body;
    try {
        const check = await newusertoken.check(token);
        if (check !== true) {
            res.sendError(check, 500);
        } else {
            res.status(201).send({ message: 'Token válido.' });
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
