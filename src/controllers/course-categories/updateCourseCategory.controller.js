// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'addCourseCategory' function of the 'course categories'
//  class controller
// Data: 2021/08/31
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

const checkAddCoursesCategories = require('@functions/checkAddCoursesCategories');

exports.updateCourseCategory = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const { name } = req.body;
        const { id } = req.params;

        const check = await checkAddCoursesCategories.check(name);

        if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const whereColumns = {
                id: {
                    operator: '=',
                    value: id,
                },
            };
            const fieldsValues = {};
            fieldsValues.name = {
                value: name,
                type: 'string',
            };

            const result = await query.Update(
                true,
                'courses_categories',
                fieldsValues,
                ['*'],
                whereColumns,
                [''],
            );

            if (Array.isArray(result.data)) {
                res.status(201).send({ message: 'Categoria Atualizada com sucesso!' });
            } else {
                res.sendError(result.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
