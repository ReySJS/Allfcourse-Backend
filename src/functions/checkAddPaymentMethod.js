const validatePaymentMethod = require('@validations/validatePaymentMethods');

module.exports = {
    check: async (_name, _installments) => {
        // const check1SelectMethodId = ['id'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validMethodName = validatePaymentMethod.validatePaymentMethodName(
            _name,
            errors.validationErrors,
        );

        const validInstallment = validatePaymentMethod.validatePaymentMethodInstallments(
            _installments,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            name: validMethodName,
            installments: validInstallment,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
