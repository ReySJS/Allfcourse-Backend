const validateClass = require('@validations/validateClasses');
const db = require('@model/db2');

module.exports = {
    check: async (_name, _order, _moduleId, _inactive, _link, _description) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validClassName = validateClass.validateClassName(
            _name,
            errors.validationErrors,
        );

        const validOrder = validateClass.validateClassOrder(
            _order,
            errors.validationErrors,
        );

        const validModuleId = validateClass.validateClassModuleId(
            _moduleId,
            errors.validationErrors,
        );

        const validInactive = validateClass.validateClassInactive(
            _inactive,
            errors.validationErrors,
        );

        const validLink = validateClass.validateClassVideoLink(
            _link,
            errors.validationErrors,
        );

        const validDescription = validateClass.validateClassDescription(
            _description,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const resultCheck1 = await db.query('SELECT id FROM modules WHERE id = $1 AND deleted_at IS NULL', [_moduleId]);

        if (Array.isArray(resultCheck1.rows)) {
            if (resultCheck1.rows.length === 0) {
                errors.validationErrors.teacherid = {
                    message: 'Não existe nenhum módulo com o ID informado',
                    code: 500,
                };
                return errors;
            }
        } else {
            errors.criticalErrors.errorTeacherId = {
                message: 'Ocorreu um erro inesperado durante a consulta de módulos',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            name: validClassName,
            moduleid: parseInt(validModuleId, 10),
            order: validOrder,
            description: validDescription,
            inactive: validInactive,
            link: validLink,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
