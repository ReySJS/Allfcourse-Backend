/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// -----------------------------------------------------------------------------------------------//
// Archive: controllers/courses/addCourse.controller.js
// Description: File responsible for the 'addCourse' function of the 'courses' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
// const db = require('@model/db2');

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

    const check = await checkAddCourses.check(newcourse.name, req.auth.id.toString(), newcourse.price, newcourse.description);

    if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        await query.BeginTransaction(); // sem/com o await tbm ta bugando
        // também tentei mexer na sua classe q tava so connect sem o then no begin e rollback, mas n funfo
        const columnsCourse = {
            teacher_id: req.auth.id,
            name: check.name,
            description: check.description,
            price: check.price,
            status: 'em análise',
        };
        const returningColumnsCourse = ['*'];

        const resultCourse = await query.Insert(
            false,
            'courses',
            columnsCourse,
            returningColumnsCourse,
        );
        /* const resultcourse = await db.query('INSERT INTO courses(teacher_id, name, description, price, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [
                req.auth.id,
                check.name,
                check.description,
                check.price,
                'em análise',
            ]); */

        if (Array.isArray(resultCourse.data)) {
            for (const category of newcourse.course_categories) {
                const check = await checkAddCoursesCategories.check(category.name);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        /* const newcategory = await db.query('INSERT INTO courses_categories(name, created_by) VALUES($1, $2) RETURNING *',
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
                            ]); */
                        const columnsCategory = {
                            name: category,
                            created_by: req.auth.id,
                        };
                        const returningColumnsCategory = ['*'];

                        const resultCategory = await query.Insert(
                            false,
                            'courses_categories',
                            columnsCategory,
                            returningColumnsCategory,
                        );
                        if (Array.isArray(resultCategory.data)) {
                            // console.log(resultCourse.data[0].id);
                            const columnsFlag = {
                                course_id: resultCourse.data[0].id,
                                category_id: resultCategory.data[0].id,
                                created_by: req.auth.id,
                            };
                            const returningColumnsFlag = ['*'];

                            // eslint-disable-next-line no-unused-vars
                            const resultFlag = await query.Insert(
                                false,
                                'courses_flags',
                                columnsFlag,
                                returningColumnsFlag,
                            );
                        } else {
                            query.Rollback();
                            errors.criticalErrors.errorCategory = {
                                message: 'Ocorreu um ao inserir um novo curso.',
                                code: 500,
                            };
                            res.sendError(errors, 500);
                        }
                    } catch (err) {
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

            // let i = 0;
            for (const module of newcourse.course_modules) {
                // console.log(module);
                const check = await checkAddModules.check(module.name, module.description);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        const columnsModule = {
                            name: check.name,
                            description: check.description,
                        };
                        const returningColumnsModule = ['*'];

                        const resultModule = await query.Insert(
                            false,
                            'modules',
                            columnsModule,
                            returningColumnsModule,
                        );
                        /* const eachmodule = await db.query('INSERT INTO modules(name, description) VALUES($1, $2) RETURNING *',
                            [
                                check.name,
                                check.description,
                            ]);
                        await db.query('INSERT INTO module_order(course_id, module_id, module_order) VALUES($1, $2, $3)',
                            [
                                resultcourse.rows[0].id,
                                eachmodule.rows[0].id,
                                module.order,
                            ]); */
                        const columnsModuleOrder = {
                            course_id: resultCourse.data[0].id,
                            module_id: resultModule.data[0].id,
                            module_order: module.order,
                        };
                        const returningColumnsModuleOrder = ['*'];

                        const resultModuleOrder = await query.Insert(
                            false,
                            'module_order',
                            columnsModuleOrder,
                            returningColumnsModuleOrder,
                        );
                        formatedmodules.push(resultModule.data[0]);
                        // console.log(resultModuleOrder);
                        // i++;
                        if (!Array.isArray(resultModule.data) || !Array.isArray(resultModuleOrder.data)) {
                            query.Rollback();
                            errors.criticalErrors.errorCategory = {
                                message: 'Ocorreu um ao inserir um novo curso.',
                                code: 500,
                            };
                            res.sendError(errors, 500);
                        }
                    } catch (err) {
                        query.Rollback();
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
                // console.log(formatedmodules);
                const check = await checkAddClass.check(newclass.name, newclass.order, formatedmodules[newclass.position].id.toString(), newclass.inactive, newclass.link, newclass.description);
                // console.log(formatedmodules[newclass.position]);
                // console.log(newclass);
                // console.log(formatedmodules[newclass.position]);
                // console.log(newclass);
                // const index = formatedmodules.findIndex((m) => m.position);
                // const index2 = newcourse.course_classes.findIndex((p) => p.position = formatedmodules[index].position);
                // newclass.moduleid = formatedmodules[index2].id;
                // console.log(check);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        /* await db.query('INSERT INTO classes(name, class_order, module_id, inactive, description, video_link) VALUES ($1, $2, $3, $4, $5, $6)',
                            [
                                check.name,
                                check.order,
                                check.moduleid,
                                check.inactive,
                                check.description,
                                check.link,
                            ]); */
                        const columnsClass = {
                            name: check.name,
                            class_order: check.order,
                            module_id: check.moduleid,
                            inactive: check.inactive,
                            description: check.description,
                            video_link: check.link,
                        };
                        const returningColumnsClass = ['*'];

                        const resultClass = await query.Insert(
                            false,
                            'classes',
                            columnsClass,
                            returningColumnsClass,
                        );
                        if (resultClass.length <= 0) {
                            query.Rollback();
                            errors.criticalErrors.errorCategory = {
                                message: 'Ocorreu um ao inserir um novo cursosokonoooo.',
                                code: 500,
                            };
                            res.sendError(errors, 500);
                        }
                    } catch (err) {
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova aula.',
                            code: 500,
                            detail: { ...err },
                        };
                        res.sendError(errors, 500);
                    }
                }
            }
            // await db.query('COMMIT');
            query.Commit();
            res.status(201).send({ message: 'Curso criado com sucesso!' });
        } else {
            query.Rollback();
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um ao inserir um novo curso.',
                code: 500,
            };
            res.sendError(errors, 500);
        }
    }
};
