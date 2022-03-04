// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'deleteEnrollStudent' function of the 'enroll-students' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkValidCourse = require('@functions/checkIfCourseExists');

exports.deleteEnrollStudent = async (req, res) => {
    const studentId = req.auth.id;
    const courseId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType !== 2 && userType !== 4 && userType !== 6) {
        const checkCourse = await checkValidCourse.check(courseId);

        if (Object.keys(checkCourse.validationErrors).length !== 0
        || Object.keys(checkCourse.criticalErrors).length !== 0) {
            res.sendError(checkCourse, 500);
        } else {
            const now = new Date().toLocaleString();
            const enrollColumns = {
                deleted_at: {
                    value: now,
                    type: 'string',
                },
            };
            const whereEnroll = {
                student_id: {
                    operator: '=',
                    value: studentId,
                },
                course_id: {
                    operator: '=',
                    value: checkCourse.id,
                },
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
            };
            const logicalOperators = ['AND', 'AND'];
            const returning = ['id', 'deleted_at'];

            const enrollInformations = await query.Update(
                true,
                'enroll_students',
                enrollColumns,
                returning,
                whereEnroll,
                logicalOperators,
            );

            if (Array.isArray(enrollInformations.data)) {
                if (enrollInformations.data.length > 0) {
                    res.status(200).send({ message: 'Matrícula excluída com sucesso!' });
                } else {
                    res.sendError('Alguma coisa ocorreu errado ou não há matrícula para excluir', 500);
                }
            } else {
                res.sendError(enrollInformations.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
