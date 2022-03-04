// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'updateUserData' function of the 'users' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const validateUserdata = require('@validations/validateRegister');

exports.updateUserData = async (req, res) => {
    const userType = req.auth.type;
    const userId = req.auth.id;
    const { lastName } = req.body;
    const { phone } = req.body;
    const { gender } = req.body;
    const { socialName } = req.body;
    const errors = { criticalErrors: {}, validationErrors: {} };

    if (userType >= 1 && userType <= 7) {
        const validLast = validateUserdata.validateLastName(
            lastName,
            errors.validationErrors,
        );

        const validPhone = validateUserdata.validatePhone(
            phone,
            errors.validationErrors,
        );

        const validGender = validateUserdata.validateGender(
            gender,
            errors.validationErrors,
        );

        const validSocialName = validateUserdata.validateSocialName(
            socialName,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length !== 0
        || Object.keys(errors.criticalErrors).length !== 0) {
            res.sendError(errors, 500);
        } else {
            const now = new Date().toLocaleString();
            const usersColumns = {
                updated_at: {
                    value: now,
                    type: 'string',
                },
                last_name: {
                    value: validLast,
                    type: 'string',
                },
                gender: {
                    value: validGender,
                    type: 'string',
                },
                phone: {
                    value: parseInt(validPhone, 10),
                    type: 'integer',
                },
                social_name: {
                    value: validSocialName,
                    type: 'string',
                },
            };
            const whereUsers = {
                id: {
                    operator: '=',
                    value: userId,
                },
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
                active: {
                    operator: 'is',
                    value: true,
                },
            };
            const logicalOperators = ['AND', 'AND'];
            const returning = ['id', 'updated_at', 'last_name', 'social_name', 'phone', 'gender'];

            const userInformations = await query.Update(
                true,
                'users',
                usersColumns,
                returning,
                whereUsers,
                logicalOperators,
            );

            if (Array.isArray(userInformations.data)) {
                if (userInformations.data.length > 0) {
                    res.status(200).send({ message: 'Dados atualizados com sucesso!' });
                } else {
                    res.sendError('Alguma coisa ocorreu errado', 500);
                }
            } else {
                res.sendError(userInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
