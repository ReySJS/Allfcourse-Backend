const validateModules = require('@validations/validateModules');

module.exports = {
    check: async (_name, _description) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validModuleName = validateModules.validateModuleName(
            _name,
            errors.validationErrors,
        );

        const validDescription = validateModules.validateModuleDescription(
            _description,
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
            name: validModuleName,
            description: validDescription,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
