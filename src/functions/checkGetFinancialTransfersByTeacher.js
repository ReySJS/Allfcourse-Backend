const query = require('@helpers/Query');
const validateTeacherId = require('@validations/validateCourses');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validTeacherId = validateTeacherId.validateCourseTeacherId(
            _id,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectTeacherId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validTeacherId,
            },
            active: {
                operator: 'is',
                value: true,
            },
            type: {
                operator: 'not in',
                value: [1, 4],
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND', 'AND', 'AND'];

        const resultCheck1 = await query.Select(
            'users',
            check1SelectTeacherId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhum professor com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta de professores',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validTeacherId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
