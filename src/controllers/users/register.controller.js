// -----------------------------------------------------------------------------------------------//
// Archive: controllers/users/register.controller.js
// Description: File responsible for the 'register' function of the 'users' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const config = require('@config');
require('dotenv').config();

const emailrequest = require('@functions/sendConfirmationEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const checkregister = require('@functions/checkRegister');

exports.addUser = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { socialName } = req.body;
    const { gender } = req.body;
    const { document } = req.body;
    const { birthDate } = req.body;
    const { phone } = req.body;
    const { email } = req.body;
    // const { avatar } = req.body;
    const { type } = req.body;
    const { password } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expire = new Date();
    expire.setHours(expire.getHours() + 2);

    try {
        const check = await checkregister.check(document, email, phone, firstName, lastName, gender, birthDate, password, type, socialName);
        if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const encryptedPasswd = await bcrypt.hash(check.password, 10);

            const columns = {
                first_name: check.firstName,
                last_name: check.lastName,
                social_name: check.socialName,
                document: check.document,
                email: check.email,
                phone: parseInt(check.phone, 10),
                password: encryptedPasswd,
                gender: check.gender,
                birth_date: check.birthDate,
                profile_photo: `http://${config.app.host}:${config.app.port}/profilephoto/default.png`,
                type: check.type,
                email_token: token,
                etoken_expire: expire,
            };
            console.log(columns);
            const returningColumns = ['*'];
            const result = await query.Insert(
                true,
                'users',
                columns,
                returningColumns,
            );
            console.log(result);
            if (result.error.transaction !== false) {
                console.log('1', result);
                res.sendError({ message: result.error.transaction }, 500);
            } else {
                console.log('2', result);
                await emailrequest.send(email, firstName, token);
                res.status(201).send({ message: result.data });
            }
        }
    } catch (err) {
        console.log(err);
        errors.criticalErrors.errorCategory = {
            message: 'Ocorreu um erro inesperado.',
            code: 500,
            detail: { ...err },
        };
        res.sendError(errors, 501);
    }
};
