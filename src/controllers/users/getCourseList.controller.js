// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getstudent' function of the 'users' class controller
// Data: 2021/09/03
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getCourseList = async (req, res) => {
    const userId = req.auth.id;
    const userType = req.auth.type;
    if (userType >= 1 && userType <= 7) {
        const studentColumns = [
            'COUNT (enroll_students.id) as student_in',
        ];
        const whereStudent = {
            student_id: {
                operator: '=',
                value: userId,
            },
            deleted_at: {
                operator: 'is',
                value: 'null',
            },
        };
        const whereStudentOperators = ['AND'];

        const studentIn = await query.Select(
            'enroll_students',
            studentColumns,
            whereStudent,
            whereStudentOperators,
        );

        const teacherColumns = [
            'COUNT (courses.id) as teacher_in',
        ];
        const whereTeacher = {
            teacher_id: {
                operator: '=',
                value: userId,
            },
            deleted_at: {
                operator: 'is',
                value: 'null',
            },
        };
        const whereTeacherOperators = ['AND'];

        const teacherIn = await query.Select(
            'courses',
            teacherColumns,
            whereTeacher,
            whereTeacherOperators,
        );

        if (Array.isArray(studentIn.data) && Array.isArray(teacherIn.data)) {
            const resObject = {};
            resObject.teacherIn = teacherIn.data[0].teacher_in;
            resObject.studentIn = studentIn.data[0].student_in;

            res.status(201).send([resObject]);
        } else if (!Array.isArray(teacherIn.data) && Array.isArray(studentIn.data)) {
            res.sendError('Ocorreu um erro ao fazer a consulta dos cursos', 500);
        } else if (!Array.isArray(studentIn.data) && Array.isArray(teacherIn.data)) {
            res.sendError('Ocorreu um erro ao fazer a consulta dos alunos matriculados');
        } else if (!Array.isArray(studentIn.data) && !Array.isArray(teacherIn.data)) {
            res.sendError('Ocorreu um erro ao fazer a consulta dos cursos e dos alunos matriculados');
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
