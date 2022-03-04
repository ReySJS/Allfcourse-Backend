const query = require('@helpers/Query');

const checkAddClass = require('@functions/checkAddClasses');

exports.addClass = async (req, res) => {
    const { name } = req.body;
    const { order } = req.body;
    const { moduleid } = req.body;
    const { inactive } = req.body;
    const { link } = req.body;
    const { description } = req.body;

    const check = await checkAddClass.check(name, order, moduleid, inactive, link, description);

    if (Object.keys(check.validationErrors).length !== 0
            || Object.keys(check.criticalErrors).length !== 0) {
        res.sendError(check, 500);
    } else {
        const columns = {
            name: check.name,
            class_order: check.order,
            module_id: check.moduleid,
            inactive: check.inactive,
            description: check.description,
            video_link: check.link,
        };
        const returningColumns = ['*'];

        const result = await query.Insert(
            true,
            'classes',
            columns,
            returningColumns,
        );

        if (Array.isArray(result.data)) {
            res.status(201).send({ message: 'Aula adicionada com sucesso!' });
        } else {
            res.sendError(result.error, 500);
        }
    }
};
