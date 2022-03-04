// /* eslint-disable no-unused-vars */
const validateCourseCategory = require('@validations/validateCoursesCategories');
const query = require('@helpers/Query');

module.exports = {
    check: async (_name) => {
        const check1SelectCategoryName = ['name'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCategoryName = validateCourseCategory.validateCategoryName(
            _name,
            errors.validationErrors,
        );
        const whereCheck1 = {
            name: {
                operator: 'LIKE',
                value: validCategoryName,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'courses_categories',
            check1SelectCategoryName,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length !== 0) {
                errors.validationErrors.categoryname = {
                    message: 'Já existe uma categoria com o nome informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta de categorias',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
          || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            name: validCategoryName,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },

};
