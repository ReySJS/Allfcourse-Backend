require('dotenv').config();
const query = require('@helpers/Query');

exports.deleteuser = async (req, res) => {
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
                id: {
                    operator: '=',
                    value: parseInt(id, 10),
                },
            };
            const userFound = await query.Select(
                'users',
                checkSelect,
                whereCheck,
                [''],
            );

            console.log(userFound);

            if (userFound.data.length <= 0) {
                res.status(404).send({ message: 'Usuário não encontrado' });
            } else if (userFound.data[0].id === currentuser) {
                res.status(404).send({ message: 'Você não pode se auto deletar' });
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
                await query.Update(true, 'users', fieldValues, ['*'], whereColumns, ['']);
                res.status(201).send({ message: 'Usuário deletado com sucesso' });
            }
        } catch (err) {
            console.log(err);
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um ao deletar um usuário.',
                code: 500,
                detail: { ...err },
            };
            res.sendError(err, 500);
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
