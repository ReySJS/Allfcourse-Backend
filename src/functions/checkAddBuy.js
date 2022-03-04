const validateSale = require('@validations/validateSales');
const Query = require('@helpers/Query');

module.exports = {
    check: async (_courseId, _studentId, _price, _paymentMethodId) => {
        const check1SelectCourseId = ['name'];
        const check2SelectStudentId = ['type'];
        const check3SelectPaymentId = ['name'];
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validCourseId = validateSale.validateSaleCourseId(
            _courseId,
            errors.validationErrors,
        );

        const validStudentId = validateSale.validateSaleStudentId(
            _studentId,
            errors.validationErrors,
        );
        const validSalePrice = validateSale.validateSalePrice(
            _price,
            errors.validationErrors,
        );

        const validPaymentMethodId = validateSale.validateSalePaymentMethodId(
            _paymentMethodId,
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
                operator: 'like',
                value: 'aprovado',
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
                value: validStudentId,
            },
            active: {
                operator: 'is',
                value: true,
            },
            deleted_at: {
                operator: 'is',
                value: 'null',
            },
            type: {
                operator: 'not in',
                value: [2, 4],
            },
        };
        const logicalOperatorCheck2 = ['AND', 'AND', 'AND'];

        const whereCheck3 = {
            id: {
                operator: '=',
                value: validPaymentMethodId,
            },
        };

        const resultCheck1 = await Query.Select(
            'courses',
            check1SelectCourseId,
            whereCheck1,
            logicalOperatorCheck1,
        );

        const resultCheck2 = await Query.Select(
            'users',
            check2SelectStudentId,
            whereCheck2,
            logicalOperatorCheck2,
        );

        const resultCheck3 = await Query.Select(
            'payment_method',
            check3SelectPaymentId,
            whereCheck3,
            [''],
        );

        if (Array.isArray(resultCheck1.data)) {
            if (resultCheck1.data.length === 0) {
                errors.validationErrors.courseid = {
                    message: 'Não existe nenhum curso com o ID informado ou o curso não está aprovado',
                    code: 500,
                };
            }
        } else {
            console.log('blpokdsfpokfpokfds');
            console.log(resultCheck1);
            errors.criticalErrors.errorCourseId = {
                message: 'Ocorreu um erro inesperado durante a consulta de cursos',
                code: 500,
                detail: { ...resultCheck1.error },
            };
        }

        if (Array.isArray(resultCheck2.data)) {
            if (resultCheck2.data.length === 0) {
                errors.validationErrors.studentid = {
                    message: 'Não existe nenhum estudante com o ID informado',
                    code: 500,
                };
            }
        } else {
            console.log(resultCheck2.error);
            errors.criticalErrors.errorStudentId = {
                message: 'Ocorreu um erro inesperado durante a consulta de estudantes',
                code: 500,
                detail: { ...resultCheck2.error },
            };
        }

        if (Array.isArray(resultCheck3.data)) {
            if (resultCheck3.data.length === 0) {
                errors.validationErrors.paymentmethodid = {
                    message: 'Não existe nenhum método de pagamento com o ID informado',
                    code: 500,
                };
            }
        } else {
            errors.criticalErrors.errorPaymentMethodId = {
                message: 'Ocorreu um erro inesperado durante a consulta de métodos de pagamento',
                code: 500,
                detail: { ...resultCheck3.error },
            };
        }

        if (Object.keys(errors.validationErrors).length > 0
            || Object.keys(errors.criticalErrors).length > 0) {
            return errors;
        }

        return {
            course_id: validCourseId,
            student_id: validStudentId,
            price: validSalePrice,
            payment_method_id: validPaymentMethodId,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    },
};
