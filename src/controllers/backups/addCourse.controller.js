// -----------------------------------------------------------------------------------------------//
// Archive: controllers/courses/addCourse.controller.js
// Description: File responsible for the 'addCourse' function of the 'courses' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

const checkAddCourses = require('@functions/checkAddCourses');

exports.addCourse = async (req, res) => {
    const { name } = req.body;
    const { teacherid } = req.body;
    const { description } = req.body;
    const { price } = req.body;

    const check = await checkAddCourses.check(name, teacherid, price, description);

    console.log(check);
    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        const columns = {
            name: check.name,
            teacher_id: check.teacherid,
            price: check.price,
            description: check.description,
            status: 'em análise',
        };
        const returningColumns = ['*'];

        const result = await query.Insert(
            false,
            'courses',
            columns,
            returningColumns,
        );

        if (Array.isArray(result.data)) {
            res.status(201).send({ message: 'Curso adicionado com sucesso!' });
        } else {
            res.sendError(result.error, 500);
        }
    }
};
