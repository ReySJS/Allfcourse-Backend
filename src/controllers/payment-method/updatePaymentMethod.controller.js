// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'addCourseCategory' function of the 'course categories'
//  class controller
// Data: 2021/08/31
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkUpdatePaymentMethod = require('@functions/checkUpdatePaymentMethod');
const checkPaymentMethod = require('@functions/checkIfPaymentMethodExists');

exports.updatePaymentMethod = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const { name } = req.body;
        const { installments } = req.body;
        const { id } = req.params;

        if (!name && !installments) {
            res.send({
                message:
                    'Você deve informar um novo nome ou novas parcelas a serem alteradas',
            });
        } else {
            const check = await checkUpdatePaymentMethod.check(
                name,
                installments,
            );
            const check2 = await checkPaymentMethod.check(id);

            if (
                Object.keys(check.validationErrors).length !== 0
                || Object.keys(check.criticalErrors).length !== 0
                || Object.keys(check2.validationErrors.length !== 0)
                || Object.keys(check2.criticalErrors.length !== 0)
            ) {
                if (
                    Object.keys(check.validationErrors).length !== 0
                    || Object.keys(check.criticalErrors).length !== 0
                ) {
                    res.sendError(check, 500);
                } else if (
                    Object.keys(check2.validationErrors).length !== 0
                    || Object.keys(check2.criticalErrors).length !== 0
                ) {
                    res.sendError(check2, 500);
                } else {
                    const fieldsValues = {};
                    if (name && installments) {
                        fieldsValues.name = {
                            value: name,
                            type: 'string',
                        };
                        fieldsValues.installments = {
                            value: installments,
                            type: 'integer',
                        };
                    } else if (name && !installments) {
                        fieldsValues.name = {
                            value: name,
                            type: 'string',
                        };
                    } else if (installments && !name) {
                        fieldsValues.installments = {
                            value: installments,
                            type: 'integer',
                        };
                    }
                    const whereColumns = {
                        id: {
                            operator: '=',
                            value: id,
                        },
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                    };
                    const updateLogicalOperators = ['AND'];

                    const result = await query.Update(
                        true,
                        'payment_method',
                        fieldsValues,
                        ['*'],
                        whereColumns,
                        updateLogicalOperators,
                    );

                    if (Array.isArray(result.data)) {
                        res.status(201).send({
                            message:
                                'Metódo de pagamento Atualizado com sucesso!',
                        });
                    } else {
                        res.sendError(result.error, 500);
                    }
                }
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
