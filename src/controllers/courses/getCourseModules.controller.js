// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getModulesByCourse' function of the 'courses' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkGetModulesByCourse = require('@app/functions/checkIfCourseExists');

exports.getModulesByCourse = async (req, res) => {
    const courseId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType >= 1 && userType <= 7) {
        if (courseId !== '0') {
            const check = await checkGetModulesByCourse.check(
                courseId,
            );

            if (Object.keys(check.validationErrors).length !== 0
                    || Object.keys(check.criticalErrors).length !== 0) {
                res.sendError(check, 500);
            } else {
                const selectModuleInformations = [
                    'modules.id',
                    'modules.name',
                    'modules.module_order',
                ];
                const whereCheck1 = {
                    course_id: {
                        operator: '=',
                        value: check.id,
                    },
                    deleted_at: {
                        operator: 'IS',
                        value: 'null',
                    },
                };
                const logicalOperatorCheck1 = ['AND'];

                const moduleInformations = await query.Select(
                    'modules',
                    selectModuleInformations,
                    whereCheck1,
                    logicalOperatorCheck1,
                );

                if (Array.isArray(moduleInformations.data)) {
                    res.status(200).send(moduleInformations.data);
                } else {
                    res.sendError(moduleInformations.error, 500);
                }
            }
        } else {
            const columns = [
                'modules.id as module_id',
                'modules.name as module_name',
                'modules.module_order as module_order',
                'courses.id as course_id',
                'courses.name as course_name',
                'users.id as teacher_id',
                'CONCAT(users.first_name, \' \', users.last_name) as teacher_name',
            ];
            const table = ['modules'];
            const where = {
                'modules.deleted_at': {
                    operator: 'is',
                    value: 'null',
                },
            };
            const logicalOperator = [''];
            const join = {
                courses: {
                    join: 'join',
                    on: {
                        id: {
                            operator: '=',
                            value: 'modules.course_id',
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
            const order = ['courses.name', 'modules.course_id', 'modules.name', 'modules.module_order'];

            const modules = await query.Select(table, columns, where, logicalOperator, order, join);

            if (Array.isArray(modules.data)) {
                res.status(200).send(modules.data);
            } else {
                res.sendError('Ocorreu um erro inesperado durante a consulta dos módulos', 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
