/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// -----------------------------------------------------------------------------------------------//
// Archive: controllers/courses/addCourse.controller.js
// Description: File responsible for the 'addCourse' function of the 'courses' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

// const query = require('@helpers/Query');
const db = require('@model/db2');

const checkAddCourses = require('@functions/checkAddCourses');
const checkAddCoursesCategories = require('@app/functions/checkAddCoursesCategories');
const checkAddModules = require('@functions/checkAddModule');
const checkAddClass = require('@functions/checkAddClasses');

exports.addCourse2 = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const newcourse = {};
    const formatedmodules = [];
    newcourse.name = req.body.coursename;
    newcourse.description = req.body.description;
    newcourse.price = req.body.price;
    newcourse.course_categories = req.body.course_categories;
    newcourse.course_modules = req.body.course_modules;
    newcourse.course_classes = req.body.course_classes;
    newcourse.course_classes.moduleid = null;
    console.log(req.auth);

    const check = await checkAddCourses.check(newcourse.name, req.auth.id, newcourse.price, newcourse.description);

    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        await db.query('BEGIN');
        const resultcourse = await db.query('INSERT INTO courses(teacher_id, name, description, price, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [
                req.auth.id,
                check.name,
                check.description,
                check.price,
                'em análise',
            ]);

        if (resultcourse.rows.length >= 1) {
            for (const category of newcourse.course_categories) {
                const check = await checkAddCoursesCategories.check(category.name);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        const newcategory = await db.query('INSERT INTO courses_categories(name, created_by) VALUES($1, $2) RETURNING *',
                            [
                                category,
                                req.auth.id,
                            ]);
                        // console.log(newcategory.rows);
                        await db.query('INSERT INTO courses_flags(course_id, category_id, created_by) VALUES($1, $2, $3) RETURNING *',
                            [
                                resultcourse.rows[0].id,
                                newcategory.rows[0].id,
                                req.auth.id,
                            ]);
                    } catch (err) {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova flag/categoria.',
                            code: 500,
                            detail: { ...err },
                        };
                        console.log(err);
                        res.sendError(errors, 500);
                    }
                }
            }

            for (const module of newcourse.course_modules) {
                const check = await checkAddModules.check(module.name, module.description);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        const eachmodule = await db.query('INSERT INTO modules(name, description) VALUES($1, $2) RETURNING *',
                            [
                                check.name,
                                check.description,
                            ]);
                        await db.query('INSERT INTO module_order(course_id, module_id, module_order) VALUES($1, $2, $3)',
                            [
                                resultcourse.rows[0].idsu,
                                eachmodule.rows[0].id,
                                module.order,
                            ]);
                        formatedmodules.push(eachmodule.rows[0]);
                    } catch (err) {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir um novo modulo.',
                            code: 500,
                            detail: { ...err },
                        };
                        res.sendError(errors, 500);
                    }
                }
            }

            formatedmodules.forEach((module, i) => {
                module.position = i;
            });
            for (const newclass of newcourse.course_classes) {
                const check = await checkAddClass.check(newclass.name, newclass.order, formatedmodules[newclass.position].id.toString(), newclass.inactive, newclass.link, newclass.description);
                // console.log(formatedmodules);
                // console.log(formatedmodules[newclass.position]);
                // console.log(newclass);
                // console.log(formatedmodules[newclass.position]);
                // console.log(newclass);
                // const index = formatedmodules.findIndex((m) => m.position);
                // const index2 = newcourse.course_classes.findIndex((p) => p.position = formatedmodules[index].position);
                // newclass.moduleid = formatedmodules[index2].id;
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        await db.query('INSERT INTO classes(name, class_order, module_id, inactive, description, video_link) VALUES ($1, $2, $3, $4, $5, $6)',
                            [
                                check.name,
                                check.order,
                                check.moduleid,
                                check.inactive,
                                check.description,
                                check.link,
                            ]);
                    } catch (err) {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova aula.',
                            code: 500,
                            detail: { ...err },
                        };
                        res.sendError(errors, 500);
                    }
                }
            }
            await db.query('COMMIT');
            res.status(201).send({ message: 'Curso criado com sucesso!' });
        } else {
            res.send('ERRO');
        }
    }
};
