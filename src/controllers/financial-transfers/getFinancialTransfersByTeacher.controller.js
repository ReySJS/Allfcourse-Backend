// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getFinancialTransfersByTeacher' function of the 'financial-transfers' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkGetFinancialTransfers = require('@app/functions/checkGetFinancialTransfersByTeacher');

exports.getFinancialTransfersByTeacher = async (req, res) => {
    const teacherId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType >= 4 && userType <= 7) {
        if (teacherId !== '0') {
            const check = await checkGetFinancialTransfers.check(
                teacherId,
            );

            if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
            } else {
                const selectFinancialInformations = [
                    'financial_transfer.id',
                    'financial_transfer.sale_id',
                    'financial_transfer.teacher_id',
                    'CONCAT(users.first_name, \' \', users.last_name) as teacher_name',
                    'CONCAT(\'R$\', financial_transfer.price) as price',
                    'financial_transfer.due_date as due_date',
                    'financial_transfer.pay_date as pay_date',
                    'financial_transfer.created_at as created_at',
                ];
                const whereCheck1 = {
                    teacher_id: {
                        operator: '=',
                        value: check.id,
                    },
                    'financial_transfer.deleted_at': {
                        operator: 'IS',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = ['AND'];
                const orderBy = ['financial_transfer.created_at desc'];

                const join = {
                    users: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'financial_transfer.teacher_id',
                            },
                            active: {
                                operator: 'is',
                                value: true,
                            },
                            deleted_at: {
                                operator: 'IS',
                                value: 'null',
                            },
                        },
                        logicalOperators: ['AND', 'AND'],
                    },
                };

                const financialInformations = await query.Select(
                    'financial_transfer',
                    selectFinancialInformations,
                    whereCheck1,
                    logicalOperatorCheck1,
                    orderBy,
                    join,
                );

                if (Array.isArray(financialInformations.data)) {
                    res.status(200).send(financialInformations.data);
                } else {
                    res.sendError(financialInformations.error, 500);
                }
            }
        } else {
            const selectFinancialInformations = [
                'financial_transfer.id',
                'financial_transfer.sale_id',
                'financial_transfer.teacher_id',
                'CONCAT(users.first_name, \' \', users.last_name) as teacher_name',
                'CONCAT(\'R$\', financial_transfer.price) as price',
                'financial_transfer.due_date as due_date',
                'financial_transfer.pay_date as pay_date',
                'financial_transfer.created_at as created_at',
            ];
            const whereCheck1 = {
                'financial_transfer.deleted_at': {
                    operator: 'IS',
                    value: 'null',
                },
            };
            const logicalOperatorCheck1 = [''];
            const orderBy = ['financial_transfer.created_at desc'];

            const join = {
                users: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'financial_transfer.teacher_id',
                        },
                        active: {
                            operator: 'is',
                            value: true,
                        },
                        deleted_at: {
                            operator: 'IS',
                            value: 'null',
                        },
                    },
                    logicalOperators: ['AND', 'AND'],
                },
            };

            const financialInformations = await query.Select(
                'financial_transfer',
                selectFinancialInformations,
                whereCheck1,
                logicalOperatorCheck1,
                orderBy,
                join,
            );

            if (Array.isArray(financialInformations.data)) {
                res.status(200).send(financialInformations.data);
            } else {
                res.sendError(financialInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
