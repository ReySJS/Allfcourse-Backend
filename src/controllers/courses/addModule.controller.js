const query = require('@helpers/Query');

const checkAddModules = require('@functions/checkAddModule');

exports.addModule = async (req, res) => {
    const { name } = req.body;
    const { description } = req.body;

    const check = await checkAddModules.check(name, description);

    if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        const columns = {
            name: check.name,
            description: check.description,
        };
        const returningColumns = ['*'];

        const result = await query.Insert(
            true,
            'modules',
            columns,
            returningColumns,
        );

        if (Array.isArray(result.data)) {
            res.status(201).send({ message: 'Módulo adicionado com sucesso!' });
        } else {
            res.sendError(result.error, 500);
        }
    }
};
