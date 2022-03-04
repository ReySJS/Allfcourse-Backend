require('dotenv').config();
const db = require('@model/db2');

exports.deletecourse = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const { id } = req.params;
        const currentuser = req.auth.id;
        const errors = { criticalErrors: {}, validationErrors: {} };
        const now = new Date().toLocaleString();

        async function deleteClasses(modules) {
            for (const module of modules.rows) {
                const result = await db.query('UPDATE classes SET deleted_at = $1 WHERE module_id = $2 RETURNING *', [now, module.id]);
                if (result.severity === 'ERROR') {
                    await db.query('ROLLBACK');
                    errors.criticalErrors.error = {
                        message: 'Ocorreu um ao deletar as aulas.',
                        code: 500,
                        detail: { ...result },
                    };
                    return errors;
                }
            }
            return true;
        }

        async function deleteModules() {
            const result = await db.query('UPDATE modules SET deleted_at = $1, deleted_by = $2 WHERE course_id = $3 RETURNING *', [now, currentuser, id]);
            if (result.severity === 'ERROR') {
                await db.query('ROLLBACK');
                errors.criticalErrors.error = {
                    message: 'Ocorreu um ao deletar os modulos.',
                    code: 500,
                    detail: { ...result },
                };
                return errors;
            }
            return true;
        }

        async function deleteCourses() {
            const result = await db.query('UPDATE courses SET deleted_at = $1, deleted_by = $2 WHERE id = $3', [now, currentuser, id]);
            if (result.severity === 'ERROR') {
                await db.query('ROLLBACK');
                errors.criticalErrors.error = {
                    message: 'Ocorreu um ao deleta o curso.',
                    code: 500,
                    detail: { ...result },
                };
                return errors;
            }
            return true;
        }

        if (!id) {
            res.status(400).send({ message: 'Insira um ID válido' });
        }

        try {
            const checkCourse = await db.query('SELECT * from courses where id = $1', [id]);

            if (checkCourse.rows.length <= 0) {
                res.status(404).send({ message: 'Curso não encontrado' });
            } else {
                const modules = await db.query('SELECT * from modules where course_id = $1', [id]);
                await db.query('BEGIN');

                const deleteclass = await deleteClasses(modules);
                if (!deleteclass.criticalErrors) {
                    const deletemodule = await deleteModules();
                    if (!deletemodule.criticalErrors) {
                        const deletecourse = await deleteCourses();
                        if (!deletecourse.criticalErrors) {
                            await db.query('COMMIT');
                            res.status(201).send({ message: 'Curso deletado com sucesso' });
                        } else {
                            res.sendError(deletecourse, 500);
                        }
                    } else {
                        res.sendError(deletemodule, 500);
                    }
                } else {
                    res.sendError(deleteclass, 500);
                }
            }
        } catch (err) {
            console.log(err);
            errors.criticalErrors.error = {
                message: 'Ocorreu um ao deletar um curso.',
                code: 500,
                detail: { ...err },
            };
            res.sendError(err, 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
