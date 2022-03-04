// -----------------------------------------------------------------------------------------------//
// Archive: controllers/recovery/resetPass.controller.js
// Description: File responsible for the 'resetPass' function of the 'recovery' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const newuserpass = require('@functions/checkResetPassToken');

exports.resetPass = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { token } = req.body;
    const { password } = req.body;
    const { confirmPassword } = req.body;
    try {
        const check = await newuserpass.check(token, password, confirmPassword);
        if (check !== true) {
            res.sendError(check, 500);
        } else {
            res.status(201).send({ message: 'Senha alterada com sucesso' });
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
