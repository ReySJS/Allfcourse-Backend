// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getSalesByCourseId' function of the 'sales' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkCourse = require('@app/functions/checkIfCourseExists');

exports.getSalesByCourseId = async (req, res) => {
    const courseId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType >= 4 && userType <= 7) {
        if (courseId !== '0') {
            const check = await checkCourse.check(
                courseId,
            );

            if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
            } else {
                const selectSalesInformations = [
                    'sales.id as sale_id',
                    'sales.course_id as course_id',
                    'courses.name as course_name',
                    'sales.student_id as student_id',
                    `CASE
                    WHEN
                        users.social_name IS NULL
                    THEN
                        CONCAT(users.first_name, ' ', users.last_name)
                    ELSE
                        CONCAT(users.social_name, ' ', users.last_name)
                    END AS student_name`,
                    'sales.payment_method_id as payment_method_id',
                    'CONCAT(payment_method.name, \' em \', payment_method.installments, \'x\') as payment_method',
                    'CONCAT(\'R$\', sales.price) as price',
                    'sales.created_at as release_date',
                ];
                const whereCheck1 = {
                    'sales.course_id': {
                        operator: '=',
                        value: check.id,
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
                            deleted_at: {
                                operator: 'is',
                                value: 'null',
                            },
                            status: {
                                operator: 'like',
                                value: 'aprovado',
                            },
                        },
                        logicalOperators: ['AND', 'AND'],
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
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                        status: {
                            operator: 'like',
                            value: 'aprovado',
                        },
                    },
                    logicalOperators: ['AND', 'AND'],
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
