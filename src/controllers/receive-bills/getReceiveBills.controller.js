// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getReceiveBills' function of the 'receive-bills' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const validateBills = require('@app/validations/validateSales');

exports.getReceiveBills = async (req, res) => {
    const billId = req.params.id.toString();
    const errors = { criticalErrors: {}, validationErrors: {} };
    const userType = req.auth.type;

    if (userType >= 4 && userType <= 7) {
        if (billId !== '0') {
            const validBillId = await validateBills.validateSaleId(
                billId,
                errors.validationErrors,
            );

            if (Object.keys(errors.validationErrors).length !== 0
            || Object.keys(errors.criticalErrors).length !== 0) {
                res.sendError(errors, 500);
            } else {
                const selectBillInformations = [
                    'id',
                    'sale_id',
                    'installment',
                    'subtotal',
                    'due_date',
                    'pay_date',
                    'created_at',
                ];
                const whereCheck1 = {
                    id: {
                        operator: '=',
                        value: validBillId,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = ['AND'];
                const orderBy = ['installment'];

                const billInformations = await query.Select(
                    'receive_bills',
                    selectBillInformations,
                    whereCheck1,
                    logicalOperatorCheck1,
                    orderBy,
                );

                if (Array.isArray(billInformations.data)) {
                    res.status(200).send(billInformations.data);
                } else {
                    res.sendError(billInformations.error, 500);
                }
            }
        } else {
            const selectBillInformations = [
                'id',
                'sale_id',
                'installment',
                'subtotal',
                'due_date',
                'pay_date',
                'created_at',
            ];
            const whereCheck1 = {
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
            };
            const logicalOperatorCheck1 = [''];
            const orderBy = ['installment'];

            const billInformations = await query.Select(
                'receive_bills',
                selectBillInformations,
                whereCheck1,
                logicalOperatorCheck1,
                orderBy,
            );

            if (Array.isArray(billInformations.data)) {
                res.status(200).send(billInformations.data);
            } else {
                res.sendError(billInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
