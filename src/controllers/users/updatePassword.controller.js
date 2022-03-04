// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'updateUserPassword' function of the 'users' class controller
// Data: 2021/08/31
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const bcrypt = require('bcrypt');
const validateUserdata = require('@validations/validateRegister');

exports.updateUserPassword = async (req, res) => {
    const userType = req.auth.type;
    const userId = req.auth.id;
    const { currentPassword } = req.body;
    const { newPassword } = req.body;

    const errors = { criticalErrors: {}, validationErrors: {} };

    if (userType >= 1 && userType <= 7) {
        const validNewPassword = validateUserdata.validatePassword(
            newPassword,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length !== 0
        || Object.keys(errors.criticalErrors).length !== 0) {
            res.sendError(errors, 500);
        } else {
            const selectPassword = ['password'];
            const whereSelectPasswd = {
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
            const logicalOperatorsSelect = ['AND', 'AND'];

            const selectedPassword = await query.Select(
                'users',
                selectPassword,
                whereSelectPasswd,
                logicalOperatorsSelect,
            );

            if (Array.isArray(selectedPassword.data)) {
                const storagedPassword = selectedPassword.data[0].password;
                const validCurrentPasswd = await bcrypt.compare(currentPassword, storagedPassword);

                if (validCurrentPasswd) {
                    const encryptedNewPassword = await bcrypt.hash(validNewPassword, 10);
                    const now = new Date().toLocaleString();
                    const usersUpdateColumns = {
                        updated_at: {
                            value: now,
                            type: 'string',
                        },
                        password: {
                            value: encryptedNewPassword,
                            type: 'string',
                        },
                    };
                    const whereUsersUpdate = {
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

                    const userUpdatedInformations = await query.Update(
                        true,
                        'users',
                        usersUpdateColumns,
                        returning,
                        whereUsersUpdate,
                        logicalOperators,
                    );

                    if (Array.isArray(userUpdatedInformations.data)) {
                        if (userUpdatedInformations.data.length > 0) {
                            res.status(200).send({ message: 'Senha atualizada com sucesso!' });
                        } else {
                            res.sendError('Alguma coisa ocorreu errado durante a atualização da senha', 500);
                        }
                    } else {
                        res.sendError(userUpdatedInformations.error, 500);
                    }
                } else {
                    res.sendError('Senha atual incorreta!', 500);
                }
            } else {
                errors.criticalErrors.errorCategory = {
                    message: 'Alguma coisa ocorreu errado durante a verificação da senha',
                    code: 500,
                    detail: { ...selectedPassword.error },
                };
                res.sendError(errors, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
