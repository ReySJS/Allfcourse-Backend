// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'login' function of the 'getCoursesInFlags' class controller
// Data: 2021/08/29
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkGetCoursesByFlags = require('@app/functions/checkGetCoursesInFlags');

exports.getCoursesInFlags = async (req, res) => {
    const flagCategoryId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType >= 1 && userType <= 7) {
        if (flagCategoryId !== '0') {
            const check = await checkGetCoursesByFlags.check(
                flagCategoryId,
            );

            if (Object.keys(check.validationErrors).length !== 0
                    || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
            } else {
                const selectCategoriesName = ['courses_categories.name'];
                const whereCheck1 = {
                    deleted_at: {
                        operator: 'IS',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = [''];

                const resultCheck1 = await query.Select(
                    'courses_categories',
                    selectCategoriesName,
                    whereCheck1,
                    logicalOperatorCheck1,
                );

                if (Array.isArray(resultCheck1.data)) {
                    const columns = [
                        'courses.id as course_id',
                        'courses.name as course_name',
                        'courses_categories.id as category_id',
                        'courses_categories.name as category_name',
                        'users.id as teacher_id',
                        `CASE
                    WHEN
                        users.social_name IS NULL
                    THEN
                        CONCAT(users.first_name, ' ', users.last_name)
                    ELSE
                        CONCAT(users.social_name, ' ', users.last_name)
                    END AS teacher_name`,
                    ];
                    const table = ['courses_flags'];
                    const where = {
                        category_id: {
                            operator: '=',
                            value: check.id,
                        },
                        'courses_flags.deleted_at': {
                            operator: 'is',
                            value: 'null',
                        },
                    };
                    const logicalOperator = ['AND'];
                    const join = {
                        courses_categories: {
                            join: 'join',
                            on: {
                                id: {
                                    operator: '=',
                                    value: 'courses_flags.category_id',
                                },
                                deleted_at: {
                                    operator: 'is',
                                    value: 'null',
                                },
                            },
                            logicalOperators: ['AND'],
                        },
                        courses: {
                            join: 'join',
                            on: {
                                id: {
                                    operator: '=',
                                    value: 'courses_flags.course_id',
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
                                    value: 'courses.teacher_id',
                                },
                                deleted_at: {
                                    operator: 'is',
                                    value: 'null',
                                },
                            },
                            logicalOperators: ['AND'],
                        },
                    };
                    const order = ['courses.name'];

                    const courses = await query.Select(table, columns, where, logicalOperator, order, join);

                    res.status(200).send(courses.data);
                } else {
                    res.sendError(resultCheck1.error, 500);
                }
            }
        } else {
            const selectCategoriesName = ['courses_categories.name'];
            const whereCheck1 = {
                deleted_at: {
                    operator: 'IS',
                    value: 'null',
                },
            };
            const logicalOperatorCheck1 = [''];

            const resultCheck1 = await query.Select(
                'courses_categories',
                selectCategoriesName,
                whereCheck1,
                logicalOperatorCheck1,
            );

            if (Array.isArray(resultCheck1.data)) {
                const columns = [
                    'courses.id as course_id',
                    'courses.name as course_name',
                    'courses_categories.id as category_id',
                    'courses_categories.name as category_name',
                    'users.id as teacher_id',
                    'CONCAT(users.first_name, \' \', users.last_name) as teacher_name',
                ];
                const table = ['courses_flags'];
                const where = {
                    'courses_flags.deleted_at': {
                        operator: 'is',
                        value: 'null',
                    },
                };
                const logicalOperator = [''];
                const join = {
                    courses_categories: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'courses_flags.category_id',
                            },
                            deleted_at: {
                                operator: 'is',
                                value: 'null',
                            },
                        },
                        logicalOperators: ['AND'],
                    },
                    courses: {
                        join: 'join',
                        on: {
                            id: {
                                operator: '=',
                                value: 'courses_flags.course_id',
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
                                value: 'courses.teacher_id',
                            },
                            deleted_at: {
                                operator: 'is',
                                value: 'null',
                            },
                        },
                        logicalOperators: ['AND'],
                    },
                };
                const order = ['courses.name', 'courses_categories.name'];

                const courses = await query.Select(table, columns, where, logicalOperator, order, join);

                const selectCategoryName = ['name'];

                const whereCategoryName = {
                    deleted_at: {
                        operator: 'IS',
                        value: 'null',
                    },
                };
                const logicalOperatorCategories = [''];

                const resultCategories = await query.Select(
                    'courses_categories',
                    selectCategoryName,
                    whereCategoryName,
                    logicalOperatorCategories,
                );

                if (Array.isArray(resultCategories.data)) {
                    if (resultCategories.data.length === 0) {
                        res.sendError('Não existe nenhuma categoria com o ID informado', 500);
                    }
                } else {
                    res.sendError('Ocorreu um erro inesperado durante a consulta das categorias', 500);
                }

                const categories = {};

                resultCategories.data.forEach((_result) => {
                    categories[_result.name] = [];
                });

                courses.data.forEach((_course) => {
                    categories[_course.category_name].push(_course);
                });

                res.status(200).send(categories);
            } else {
                res.sendError(resultCheck1.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
