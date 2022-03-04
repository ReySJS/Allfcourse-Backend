// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getSales' function of the 'sales' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const validateSales = require('@app/validations/validateSales');

exports.getSales = async (req, res) => {
    const saleId = req.params.id.toString();
    const errors = { criticalErrors: {}, validationErrors: {} };
    const userType = req.auth.type;

    if (userType >= 4 && userType <= 7) {
        if (saleId !== '0') {
            const validSaleId = await validateSales.validateSaleId(
                saleId,
                errors.validationErrors,
            );

            if (Object.keys(errors.validationErrors).length !== 0
            || Object.keys(errors.criticalErrors).length !== 0) {
                res.sendError(errors, 500);
            } else {
                const selectSalesInformations = [
                    'sales.id as sale_id',
                    'sales.course_id as course_id',
                    'courses.name as course_name',
                    'sales.student_id as student_id',
                    'CONCAT(users.first_name, \' \', users.last_name) as student_name',
                    'sales.payment_method_id as payment_method_id',
                    'CONCAT(payment_method.name, \' em \', payment_method.installments, \'x\') as payment_method',
                    'CONCAT(\'R$\', sales.price) as price',
                    'sales.created_at as release_date',
                ];
                const whereCheck1 = {
                    'sales.id': {
                        operator: '=',
                        value: validSaleId,
                    },
                    'sales.deleted_at': {
                        operator: 'IS',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = ['AND'];
                const join = {
                    courses: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'sales.course_id',
                            },
                            deleted_At: {
                                operator: 'is',
                                value: 'null',
                            },
                            status: {
                                operator: 'like',
                                value: 'aprovado',
                            },
                        },
                        logicalOperators: ['AND'],
                    },
                    users: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'sales.student_id',
                            },
                            deleted_at: {
                                operator: 'is',
                                value: 'null',
                            },
                            active: {
                                operator: 'is',
                                value: true,
                            },
                        },
                        logicalOperators: ['AND', 'AND'],
                    },
                    payment_method: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'sales.payment_method_id',
                            },
                        },
                        logicalOperators: [''],
                    },
                };

                const salesInformations = await query.Select(
                    'sales',
                    selectSalesInformations,
                    whereCheck1,
                    logicalOperatorCheck1,
                    [], // orderBy
                    join,
                );

                if (Array.isArray(salesInformations.data)) {
                    res.status(200).send(salesInformations.data);
                } else {
                    res.sendError(salesInformations.error, 500);
                }
            }
        } else {
            const selectSalesInformations = [
                'sales.id as sale_id',
                'sales.course_id as course_id',
                'courses.name as course_name',
                'sales.student_id as student_id',
                'CONCAT(users.first_name, \' \', users.last_name) as student_name',
                'sales.payment_method_id as payment_method_id',
                'CONCAT(payment_method.name, \' em \', payment_method.installments, \'x\') as payment_method',
                'CONCAT(\'R$\', sales.price) as price',
                'sales.created_at as release_date',
            ];
            const whereCheck1 = {
                'sales.deleted_at': {
                    operator: 'IS',
                    value: 'null',
                },
            };
            const logicalOperatorCheck1 = [''];
            const join = {
                courses: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'sales.course_id',
                        },
                        deleted_At: {
                            operator: 'is',
                            value: 'null',
                        },
                        status: {
                            operator: 'like',
                            value: 'aprovado',
                        },
                    },
                    logicalOperators: ['AND'],
                },
                users: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'sales.student_id',
                        },
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                        active: {
                            operator: 'is',
                            value: true,
                        },
                    },
                    logicalOperators: ['AND', 'AND'],
                },
                payment_method: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'sales.payment_method_id',
                        },
                    },
                    logicalOperators: [''],
                },
            };

            const salesInformations = await query.Select(
                'sales',
                selectSalesInformations,
                whereCheck1,
                logicalOperatorCheck1,
                ['sales.created_at desc'], // orderBy
                join,
            );

            if (Array.isArray(salesInformations.data)) {
                res.status(200).send(salesInformations.data);
            } else {
                res.sendError(salesInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
