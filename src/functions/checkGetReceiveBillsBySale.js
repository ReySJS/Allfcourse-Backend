const query = require('@helpers/Query');
const validateSale = require('@validations/validateSales');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validSaleId = validateSale.validateSaleId(
            _id,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectSaleId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validSaleId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'sales',
            check1SelectSaleId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhuma venda com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta de vendas',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validSaleId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
