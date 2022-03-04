// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getstudent' function of the 'users' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getstudent = async (req, res) => {
    const { courseId } = req.params;
    if (courseId === '0') {
        const checkSelect = ['*'];
        const studentFound = await query.Select(
            'enroll_students',
            checkSelect,
            [''],
            [''],
        );
        if (studentFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum estudante encontrado' });
        } else {
            res.status(200).send(studentFound.data);
        }
    } else {
        const checkSelect = ['*'];
        const whereCheck = {
            course_id: {
                operator: '=',
                value: courseId,
            },
        };
        const studentFound = await query.Select(
            'enroll_students',
            checkSelect,
            whereCheck,
            [''],
        );
        if (studentFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum estudante encontrado neste curso' });
        } else {
            res.status(200).send(studentFound.data);
        }
    }
};
