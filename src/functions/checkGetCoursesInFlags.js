const query = require('@helpers/Query');
const validateCategory = require('@validations/validateCoursesCategories');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCategoryId = validateCategory.validateCategoryId(_id, errors.validationErrors);

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectCategoryId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validCategoryId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'courses_categories',
            check1SelectCategoryId,
            whereCheck1,
            logicalOperatorCheck1,
        );
        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhuma categoria com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta das categorias',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validCategoryId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
