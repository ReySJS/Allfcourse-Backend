// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'deleteCourseFlag' function of the 'courses' class controller
// Data: 2021/08/31
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkValidCourse = require('@app/functions/checkIfCourseExists');
const checkValidCategory = require('@functions/checkIfCategoryExists');

exports.deleteCourseFlag = async (req, res) => {
    const courseId = req.params.courseId.toString();
    const categoryId = req.params.categoryId.toString();
    const userType = req.auth.type;

    if (userType >= 2 && userType <= 7) {
        const checkCourse = await checkValidCourse.check(courseId);
        const checkCategory = await checkValidCategory.check(categoryId);

        if (Object.keys(checkCourse.validationErrors).length !== 0
        || Object.keys(checkCourse.criticalErrors).length !== 0
        || Object.keys(checkCategory.validationErrors).length !== 0
        || Object.keys(checkCategory.criticalErrors).length !== 0) {
            const errors = {
                category: {
                    ...checkCategory,
                },
                course: {
                    ...checkCourse,
                },
            };
            res.sendError(errors, 500);
        } else {
            const selectFlags = ['id'];
            const whereSelectFlags = {
                course_id: {
                    operator: '=',
                    value: checkCourse.id,
                },
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
            };
            const logicalOperatorsF = ['AND'];

            const otherFlags = await query.Select(
                'courses_flags',
                selectFlags,
                whereSelectFlags,
                logicalOperatorsF,
            );

            if (Array.isArray(otherFlags.data)) {
                if (otherFlags.data.length > 1) {
                    const now = new Date().toLocaleString();
                    const flagsColumns = {
                        deleted_at: {
                            value: now,
                            type: 'string',
                        },
                    };
                    const whereFlags = {
                        course_id: {
                            operator: '=',
                            value: checkCourse.id,
                        },
                        category_id: {
                            operator: '=',
                            value: checkCategory.id,
                        },
                        deleted_at: {
                            operator: 'is',
                            value: 'null',
                        },
                    };
                    const logicalOperators = ['AND', 'AND'];
                    const returning = ['id', 'deleted_at'];

                    const flagsInformations = await query.Update(
                        true,
                        'courses_flags',
                        flagsColumns,
                        returning,
                        whereFlags,
                        logicalOperators,
                    );

                    if (Array.isArray(flagsInformations.data)) {
                        if (flagsInformations.data.length > 0) {
                            res.status(200).send({ message: 'Flag excluída com sucesso!' });
                        } else {
                            res.sendError('Alguma coisa ocorreu errado ou não há flag para ser excluída', 500);
                        }
                    } else {
                        res.sendError(flagsInformations.error, 500);
                    }
                } else {
                    res.sendError('O curso não pode ficar sem nenhuma flag!', 500);
                }
            } else {
                res.sendError(otherFlags, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
