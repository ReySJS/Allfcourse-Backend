require('dotenv').config();
const query = require('@helpers/Query');

exports.deletecategory = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const errors = { criticalErrors: {}, validationErrors: {} };
        const now = new Date().toLocaleString();
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ message: 'Insira um ID válido' });
        }
        const currentuser = req.auth.id;
        try {
            const checkSelect = ['*'];
            const whereCheck = {
                category_id: {
                    operator: '=',
                    value: parseInt(id, 10),
                },
                deleted_at: {
                    operator: 'IS',
                    value: 'null',
                },
            };
            const flagFound = await query.Select(
                'courses_flags',
                checkSelect,
                whereCheck,
                ['AND'],
            );

            if (flagFound.data.length >= 1) {
                errors.validationErrors.errorCategory = {
                    message: 'Você não pode deletar uma categoria sem antes desvincular as flags dela.',
                    code: 500,
                };
                res.sendError(errors, 500);
            } else {
                const whereColumns = {
                    id: {
                        operator: '=',
                        value: id,
                    },
                };
                const fieldValues = {};
                fieldValues.deleted_at = {
                    value: now,
                    type: 'string',
                };
                fieldValues.deleted_by = {
                    value: currentuser,
                    type: 'integer',
                };
                await query.Update(true, 'courses_categories', fieldValues, ['*'], whereColumns, ['']);
                res.status(201).send({ message: 'Categoria deletada com sucesso' });
            }
        } catch (err) {
            console.log(err);
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um ao deletar uma categoria.',
                code: 500,
                detail: { ...err },
            };
            res.sendError(err, 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
