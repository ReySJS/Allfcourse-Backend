const validateCourse = require('@validations/validateCourses');

module.exports = {
    check: async (_price) => {
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCoursePrice = validateCourse.validateCoursePrice(
            _price,
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
            price: validCoursePrice,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
