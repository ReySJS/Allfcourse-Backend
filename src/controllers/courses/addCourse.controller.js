// -----------------------------------------------------------------------------------------------//
// Archive: controllers/courses/addCourse.controller.js
// Description: File responsible for the 'addCourse' function of the 'courses' class controller
// Data: 2021/08/29
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const db = require('@model/db2');

const checkAddCourses = require('@functions/checkAddCourses');
const checkAddModules = require('@functions/checkAddModule');
const checkAddClass = require('@functions/checkAddClasses');

exports.addCourse = async (req, res) => {
    console.log(req.body);
    console.log(req.body.courseName);
    console.log(req.body.description);
    console.log(req.body.price);
    const { type } = req.auth;
    if (type === 2 || type === 3 || type === 7) {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const newcourse = {};
        const formatedmodules = [];
        newcourse.name = req.body.courseName;
        newcourse.description = req.body.description;
        newcourse.price = req.body.price;
        newcourse.course_categories = req.body.courseCategories;
        newcourse.course_modules = req.body.courseModules;
        newcourse.course_classes = req.body.courseClasses;
        newcourse.course_classes.moduleid = null;
        console.log(newcourse);
        async function checkCategory() {
            const categoriesid = [];
            for (const category of newcourse.course_categories) {
                try {
                    const check = await db.query('SELECT id from courses_categories WHERE name = $1 AND deleted_at IS NULL', [category]);
                    if (check.rows.length <= 0) {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Uma ou mais categorias não existem.',
                            code: 404,
                        };
                        return errors;
                    }
                    categoriesid.push(check.rows[0].id);
                } catch (err) {
                    await db.query('ROLLBACK');
                    errors.criticalErrors.errorCategory = {
                        message: 'Ocorreu um ao checar as categorias existentes.',
                        code: 500,
                        detail: { ...err },
                    };
                    console.log(err);
                    return errors;
                }
            }
            return categoriesid;
        }

        async function newcourseflag(result, categories) {
            for (const category of categories) {
                try {
                    const newflag = await db.query('INSERT INTO courses_flags(course_id, category_id, created_by) VALUES($1, $2, $3) RETURNING *',
                        [
                            result.rows[0].id,
                            category,
                            req.auth.id,
                        ]);
                    if (newflag.severity === 'ERROR') {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova flag.',
                            code: 500,
                            detail: { ...newflag },
                        };
                        return errors;
                    }
                } catch (err) {
                    await db.query('ROLLBACK');
                    errors.criticalErrors.errorCategory = {
                        message: 'Ocorreu um ao inserir uma nova flag.',
                        code: 500,
                        detail: { ...err },
                    };
                    console.log(err);
                    return errors;
                }
            }
            return true;
        }

        async function newmodule(result) {
            for (const module of newcourse.course_modules) {
                const check = await checkAddModules.check(module.name, module.description);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    res.sendError(check, 500);
                } else {
                    try {
                        const eachmodule = await db.query('INSERT INTO modules(name, description, module_order, course_id) VALUES($1, $2, $3, $4) RETURNING *',
                            [
                                check.name,
                                check.description,
                                module.order,
                                result.rows[0].id,
                            ]);
                        formatedmodules.push(eachmodule.rows[0]);
                    } catch (err) {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir um novo modulo.',
                            code: 500,
                            detail: { ...err },
                        };
                        return errors;
                    }
                }
            }
            return true;
        }

        async function newclass() {
            for (const newclass of newcourse.course_classes) {
                const check = await checkAddClass.check(newclass.name, newclass.order, formatedmodules[newclass.position].id.toString(), false, newclass.link, newclass.description);
                if (Object.keys(check.validationErrors).length !== 0 || Object.keys(check.criticalErrors).length !== 0) {
                    return check;
                }
                try {
                    const newclass = await db.query('INSERT INTO classes(name, class_order, module_id, inactive, description, video_link) VALUES ($1, $2, $3, $4, $5, $6)',
                        [
                            check.name,
                            check.order,
                            check.moduleid,
                            false,
                            check.description,
                            check.link,
                        ]);
                    if (newclass.severity === 'ERROR') {
                        await db.query('ROLLBACK');
                        errors.criticalErrors.errorCategory = {
                            message: 'Ocorreu um ao inserir uma nova aula.',
                            code: 500,
                            detail: { ...newclass },
                        };
                        return errors;
                    }
                } catch (err) {
                    await db.query('ROLLBACK');
                    errors.criticalErrors.errorCategory = {
                        message: 'Ocorreu um ao inserir uma nova aula.',
                        code: 500,
                        detail: { ...err },
                    };
                    return errors;
                }
            }
            await db.query('COMMIT');
            return true;
        }

        const check = await checkAddCourses.check(newcourse.name, req.auth.id.toString(), newcourse.price, newcourse.description);

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
                    'aprovado',
                ]);

            if (resultcourse.rows.length >= 1) {
                const checkcategoryexists = await checkCategory();
                if (!checkcategoryexists.criticalErrors) {
                    const addcategory = await newcourseflag(resultcourse, checkcategoryexists);
                    if (!addcategory.criticalErrors) {
                        const addmodule = await newmodule(resultcourse);
                        if (!addmodule.criticalErrors) {
                            formatedmodules.forEach((module, i) => {
                                module.position = i;
                            });
                            const addclass = await newclass();
                            if (!addclass.criticalErrors) {
                                res.status(201).send({ message: 'Curso criado com sucesso!' });
                            } else {
                                res.sendError(addclass, 500);
                            }
                        } else {
                            res.sendError(addmodule, 500);
                        }
                    } else {
                        res.sendError(addcategory, 500);
                    }
                } else {
                    res.sendError(checkcategoryexists, 404);
                }
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
