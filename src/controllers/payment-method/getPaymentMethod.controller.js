// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getPaymentMethod' function of the 'payment-method' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const validatePaymentMethod = require('@app/validations/validatePaymentMethods');

exports.getPaymentMethod = async (req, res) => {
    const paymentMethodId = req.params.id.toString();
    const errors = { criticalErrors: {}, validationErrors: {} };
    const userType = req.auth.type;

    if (userType >= 1 && userType <= 7) {
        if (paymentMethodId !== '0') {
            const validPaymentMethodId = await validatePaymentMethod.validatePaymentMethodId(
                paymentMethodId,
                errors.validationErrors,
            );

            if (Object.keys(errors.validationErrors).length !== 0
            || Object.keys(errors.criticalErrors).length !== 0) {
                res.sendError(errors, 500);
            } else {
                const selectPaymentMethodInformations = [
                    'id',
                    'name',
                    'installments',
                ];
                const whereCheck1 = {
                    id: {
                        operator: '=',
                        value: validPaymentMethodId,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = [''];
                const orderBy = ['name', 'installments'];

                const paymentMethodsInformations = await query.Select(
                    'payment_method',
                    selectPaymentMethodInformations,
                    whereCheck1,
                    logicalOperatorCheck1,
                    orderBy,
                );

                if (Array.isArray(paymentMethodsInformations.data)) {
                    res.status(200).send(paymentMethodsInformations.data);
                } else {
                    res.sendError(paymentMethodsInformations.error, 500);
                }
            }
        } else {
            const selectPaymentMethodInformations = [
                'id',
                'name',
                'installments',
            ];
            const whereCheck1 = {
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
            };
            const logicalOperatorCheck1 = [''];
            const orderBy = ['name', 'installments'];

            const paymentMethodsInformations = await query.Select(
                'payment_method',
                selectPaymentMethodInformations,
                whereCheck1,
                logicalOperatorCheck1,
                orderBy,
            );

            if (Array.isArray(paymentMethodsInformations.data)) {
                res.status(200).send(paymentMethodsInformations.data);
            } else {
                res.sendError(paymentMethodsInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
