const validatePaymentMethod = require('@validations/validatePaymentMethods');

module.exports = {
    check: async (_name, _installments) => {
        // const check1SelectMethodId = ['id'];
        const errors = { criticalErrors: {}, validationErrors: {} };
        let validMethodName;
        let validInstallment;

        if (_name && _installments) {
            validMethodName = validatePaymentMethod.validatePaymentMethodName(
                _name,
                errors.validationErrors,
            );
            validInstallment = validatePaymentMethod.validatePaymentMethodInstallments(
                _installments,
                errors.validationErrors,
            );
        } else if (_name && !_installments) {
            validMethodName = validatePaymentMethod.validatePaymentMethodName(
                _name,
                errors.validationErrors,
            );
        } else if (_installments && !_name) {
            validInstallment = validatePaymentMethod.validatePaymentMethodInstallments(
                _installments,
                errors.validationErrors,
            );
        }
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
