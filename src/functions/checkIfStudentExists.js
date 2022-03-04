const query = require('@helpers/Query');
const validateStudent = require('@validations/validateSales');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validStudentId = validateStudent.validateSaleStudentId(
            _id,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectStudentId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validStudentId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
            active: {
                operator: 'is',
                value: 'true',
            },
            type: {
                operator: 'not in',
                value: [1, 4],
            },
        };
        const logicalOperatorCheck1 = ['AND', 'AND', 'AND'];

        const resultCheck1 = await query.Select(
            'users',
            check1SelectStudentId,
            whereCheck1,
            logicalOperatorCheck1,
        );
        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhum estudante com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta de estudantes',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validStudentId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
