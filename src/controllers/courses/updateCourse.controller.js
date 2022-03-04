// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'addCourseCategory' function of the 'course categories'
//  class controller
// Data: 2021/09/01
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

// const query = require('@helpers/Query');
const db = require('@model/db2');
const checkUpdateCourses = require('@functions/checkUpdateCourse');
const checkIfCourseExists = require('@functions/checkIfCourseExists');
const checkIfCategoryExists = require('@functions/checkIfCategoryExists');

exports.updateCourse = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const { id } = req.params;
        const { name } = req.body;
        const { description } = req.body;
        const { price } = req.body;
        const { categories } = req.body;
        // const { photo } = req.body;
        const validCategories = [];

        async function addflag(courseid) {
            for (const category of categories) {
                const check2 = await checkIfCategoryExists.check(category);
                if (Object.keys(check2.validationErrors).length >= 1
                || Object.keys(check2.criticalErrors).length >= 1) {
                    return check2;
                }
                validCategories.push(check2.id);

                for (const validcategory of validCategories) {
                    const resultcategory = await db.query('INSERT INTO courses_flags(course_id, category_id, created_by) VALUES ($1, $2, $3)',
                        [
                            courseid,
                            validcategory,
                            req.auth.id,
                        ]);
                    // console.log(resultcategory);
                    if (resultcategory.severity === 'ERROR') {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova categoria.',
                            code: 500,
                            detail: { ...resultcategory },
                        };
                        return resultcategory;
                    }
                }
                await db.query('COMMIT');
                return true;
            }
        }

        if (!name && !description && !price && !categories) {
            res.send({
                message:
                    'Você deve informar pelo menos um dado para atualizar o curso.',
            });
        } else {
            const check = await checkIfCourseExists.check(id);
            // console.log(check);
            const check2 = await checkUpdateCourses.check(price);

            if (
                Object.keys(check.validationErrors).length === 0
                && Object.keys(check.criticalErrors).length === 0
                && Object.keys(check2.validationErrors).length === 0
                && Object.keys(check2.criticalErrors).length === 0
            ) {
                const courseFound = await db.query('SELECT * from courses where id = $1 and deleted_at is NULL', [check.id]);

                await db.query('BEGIN');
                const result = await db.query('UPDATE courses SET name = $1, description = $2, price = $3 RETURNING *',
                    [
                        name || courseFound.rows[0].name,
                        description || courseFound.rows[0].description,
                        parseFloat(check2.price).toFixed(2) || courseFound.rows[0].price,
                        // photo || courseFound.rows[0].banner_img,
                    ]);

                if (categories && typeof (categories === 'object')) {
                    const newflag = await addflag(check.id);
                    // console.log(newflag);
                    if (newflag.criticalErrors || newflag.validationErrors || newflag.severity === 'ERROR') {
                        await db.query('ROLLBACK');
                        res.sendError(newflag);
                    } else {
                        res.status(201).send({
                            message: 'Curso Atualizado com sucesso!',
                        });
                    }
                } else if (result.rows.length >= 1) {
                    res.status(201).send({
                        message: 'Curso Atualizado com sucesso!',
                    });
                } else {
                    await db.query('ROLLBACK');
                    res.sendError(check, 500);
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (Object.keys(check.validationErrors).length === 0
                && Object.keys(check.criticalErrors).length === 0) {
                    res.sendError(check2, 500);
                } else {
                    res.sendError(check, 500);
                }
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
