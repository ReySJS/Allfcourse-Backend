// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getCoursesByLoggedTeacher' function of the 'courses' class controller
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

exports.getCoursesByLoggedTeacher = async (req, res) => {
    const userType = req.auth.type;
    const loggedTeacher = req.auth.id;

    if (userType !== 1 && userType !== 4 && userType !== 5) {
        const columns = [
            'courses.id as course_id',
            'courses.name as name',
            'courses.description as description',
            'courses.price as value',
            'courses.status as status',
            'COUNT(enroll_students.id) as enrolleds',
            'courses.created_at as create_date',
        ];
        const table = ['courses'];
        const where = {
            teacher_id: {
                operator: '=',
                value: loggedTeacher,
            },
            'courses.deleted_at': {
                operator: 'is',
                value: 'null',
            },
        };
        const logicalOperator = ['AND'];
        const join = {
            enroll_students: {
                join: 'left join',
                on: {
                    course_id: {
                        operator: '=',
                        value: 'courses.id',
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

        const courses = await query.Select(
            table,
            columns,
            where,
            logicalOperator,
            order,
            join,
            ['courses.id'],
        );

        if (Array.isArray(courses.data)) {
            res.status(200).send(courses.data);
        } else {
            res.sendError('Ocorreu um problema durante a consulta de cursos', 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
