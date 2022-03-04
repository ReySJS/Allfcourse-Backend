const query = require('@helpers/Query');
const validatePaymentMethod = require('@validations/validatePaymentMethods');

module.exports = {
    check: async (_id) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validPaymentMethodId = validatePaymentMethod.validatePaymentMethodId(
            _id,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const check1SelectMethodId = ['id'];

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validPaymentMethodId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND'];

        const resultCheck1 = await query.Select(
            'payment_method',
            check1SelectMethodId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhuma método de pagamento com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta dos métodos de pagamento',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
         || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            id: validPaymentMethodId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
