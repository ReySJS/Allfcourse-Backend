const validateCourse = require('@validations/validateCourses');
const query = require('@helpers/Query');

module.exports = {
    check: async (_name, _teacherId, _price, _description) => {
        const check1SelectTeacherName = ['first_name'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCourseName = validateCourse.validateCourseName(
            _name,
            errors.validationErrors,
        );

        const validTeacherId = validateCourse.validateCourseTeacherId(
            _teacherId,
            errors.validationErrors,
        );
        const validCoursePrice = validateCourse.validateCoursePrice(
            _price,
            errors.validationErrors,
        );

        let validDescription = null;

        if (_description) {
            validDescription = validateCourse.validateCourseDescription(
                _description,
                errors.validationErrors,
            );
        }

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validTeacherId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
            active: {
                operator: 'IS',
                value: true,
            },
            type: {
                operator: 'not in',
                value: [7],
            },
        };
        const logicalOperatorCheck1 = ['AND', 'AND', 'AND'];

        const resultCheck1 = await query.Select(
            'users',
            check1SelectTeacherName,
            whereCheck1,
            logicalOperatorCheck1,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length > 0) {
                errors.validationErrors.teacherid = {
                    message: 'Não existe nenhum professor com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorTeacherId = {
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
            name: validCourseName,
            teacherid: validTeacherId,
            price: validCoursePrice,
            description: validDescription,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
