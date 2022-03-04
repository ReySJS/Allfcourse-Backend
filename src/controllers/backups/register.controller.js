// -----------------------------------------------------------------------------------------------//
// Archive: controllers/users/register.controller.js
// Description: File responsible for the 'register' function of the 'users' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
require('dotenv').config();

const emailrequest = require('@functions/sendConfirmationEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const checkregister = require('@functions/checkRegister');

exports.addUser = async (req, res) => {
    console.log(req.body);
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { socialName } = req.body;
    const { gender } = req.body;
    const { document } = req.body;
    const { birthDate } = req.body;
    const { phone } = req.body;
    const { email } = req.body;
    const { avatar } = req.body;
    const { type } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const token = crypto.randomBytes(20).toString('hex');
    const expire = new Date();
    expire.setHours(expire.getHours() + 2);
    try {
        const check = await checkregister.check(document, email, phone, firstName, lastName, gender, birthDate);
        if (check !== true) {
            res.sendError(check, 500);
        } else {
            const columns = {
                first_name: firstName,
                last_name: lastName,
                social_name: socialName || null,
                document,
                email,
                phone: parseInt(phone, 10),
                password,
                gender,
                birth_date: birthDate,
                profile_photo: avatar,
                type,
                email_token: token,
                etoken_expire: expire,
            };
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
