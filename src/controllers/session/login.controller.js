// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'login' function of the 'session' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const jwt = require('@model/jwt');
const query = require('@helpers/Query');
const Login = require('@functions/checkLogin');

exports.login = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const [, hash] = req.headers.authorization.split(' ');
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

    const checkSelect = ['id', 'email', 'first_name', 'social_name', 'type', 'password', 'profile_photo'];
    const whereCheck = {
        email: {
            operator: '=',
            value: email,
        },
        active: {
            operator: 'is',
            value: true,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const checkOperators = ['AND', 'AND'];
    const userFound = await query.Select(
        'users',
        checkSelect,
        whereCheck,
        checkOperators,
    );
    console.log(userFound);
    if (userFound.data.length > 0) {
        try {
            await Login.LoginUser(userFound.data[0].password, password);
            const token = jwt.sign({
                id: userFound.data[0].id,
                email,
                name: userFound.data[0].first_name,
                socialName: userFound.data[0].social_name,
                type: userFound.data[0].type,
                photo: userFound.data[0].profile_photo,
            });

            res.cookie('auth', token).status(200).send({ message: 'Login sucedido', token });
        } catch (err) {
            if (err === 1) {
                errors.criticalErrors.email = {
                    message: 'Senha incorreta.',
                    code: 403,
                };
                res.sendError(errors, 403);
            } else {
                console.log(err);
                errors.criticalErrors.errorCategory = {
                    message: 'Ocorreu um erro inesperado.',
                    code: 500,
                    detail: { ...err },
                };
                res.sendError(errors, 500);
            }
        }
    } else {
        errors.criticalErrors.email = {
            message: 'Email não encontrado ou conta não ativada',
            code: 404,
        };
        res.sendError(errors, 404);
    }
};
