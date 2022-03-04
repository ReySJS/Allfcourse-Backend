const validateCourseFlag = require('@validations/validateCoursesFlags');
const query = require('@helpers/Query');

module.exports = {
    check: async (_courseId, _categoryId) => {
        const check1SelectCourseId = ['name'];
        const check2SelectCategoryId = ['name'];
        const check3Flag = ['id'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCourseId = validateCourseFlag.validateCourseId(
            _courseId,
            errors.validationErrors,
        );
        const validCategoryId = validateCourseFlag.validateCategoryId(
            _categoryId,
            errors.validationErrors,
        );

        if (Object.keys(errors.validationErrors).length > 0) {
            return errors;
        }

        const whereCheck1 = {
            id: {
                operator: '=',
                value: validCourseId,
            },
            status: {
                operator: 'not like',
                value: 'inativo',
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck1 = ['AND', 'AND'];

        const whereCheck2 = {
            id: {
                operator: '=',
                value: validCategoryId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck2 = ['AND'];

        const whereCheck3 = {
            course_id: {
                operator: '=',
                value: validCourseId,
            },
            category_id: {
                operator: '=',
                value: validCategoryId,
            },
            deleted_at: {
                operator: 'IS',
                value: 'null',
            },
        };
        const logicalOperatorCheck3 = ['AND', 'AND'];

        const resultCheck1 = await query.Select(
            'courses',
            check1SelectCourseId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        const resultCheck2 = await query.Select(
            'courses',
            check2SelectCategoryId,
            whereCheck2,
            logicalOperatorCheck2,
        );

        const resultCheck3 = await query.Select(
            'courses_flags',
            check3Flag,
            whereCheck3,
            logicalOperatorCheck3,
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.courseid = {
                    message: 'Não existe nenhum curso com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta dos cursos',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Array.isArray(resultCheck2.data)) {
            if (resultCheck2.data.length === 0) {
                errors.validationErrors.categoryid = {
                    message: 'Não existe nenhuma categoria com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorCategory = {
                message: 'Ocorreu um erro inesperado durante a consulta das categorias',
                code: 500,
                detail: { ...resultCheck2.error },
            };
        }

        if (Array.isArray(resultCheck3.data)) {
            if (resultCheck3.data.length !== 0) {
                errors.validationErrors.flag = {
                    message: 'O curso já pertence à categoria informada',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorFlag = {
                message: 'Ocorreu um erro inesperado durante a consulta das flags',
                code: 500,
                detail: { ...resultCheck3.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            courseid: validCourseId,
            categoryid: validCategoryId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
