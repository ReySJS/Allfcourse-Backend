// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getReceiveBillsBySale' function of the 'receive-bills' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkReceiveBillBySaleId = require('@app/functions/checkGetReceiveBillsBySale');

exports.getReceiveBillsBySale = async (req, res) => {
    const saleId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType >= 4 && userType <= 7) {
        if (saleId !== '0') {
            const check = await checkReceiveBillBySaleId.check(
                saleId,
            );

            if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
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
                    sale_id: {
                        operator: '=',
                        value: check.id,
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
