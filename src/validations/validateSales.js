module.exports = {
    validateSaleId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const saleId = _id.trim();
            const eIndex = saleId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(saleId)) && Number(saleId) > 0) {
                    const validSaleId = Number(saleId);

                    return validSaleId;
                }

                _errors.saleId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.saleId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.saleId = 'Você deve passar números como string.';
        return false;
    },
    validateSaleCourseId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const courseId = _id.trim();
            const eIndex = courseId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseId)) && Number(courseId) > 0) {
                    const validCourseId = Number(courseId);

                    return validCourseId;
                }

                _errors.saleCourseId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.saleCourseId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.saleCourseId = 'Você deve passar números como string.';
        return false;
    },
    validateSaleStudentId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const studentId = _id.trim();
            const eIndex = studentId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(studentId)) && Number(studentId) > 0) {
                    const validStudentId = Number(studentId);

                    return validStudentId;
                }

                _errors.saleStudentId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.saleStudentId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.saleStudentId = 'Você deve passar números como string.';
        return false;
    },
    validateSalePaymentMethodId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const salePaymentMethodId = _id.trim();
            const eIndex = salePaymentMethodId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(salePaymentMethodId)) && Number(salePaymentMethodId) > 0) {
                    const validSalePaymentMethodId = Number(salePaymentMethodId);

                    return validSalePaymentMethodId;
                }

                _errors.salePaymentMethodId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.salePaymentMethodId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.salePaymentMethodId = 'Você deve passar números como string';
        return false;
    },
    validateSalePrice: (_price, _errors) => {
        if (typeof (_price) === 'string') {
            const price = _price.trim();

            const eIndex = price.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                const regex = /[\d]{1,},[\d]{2}$/;

                if (regex.test(price) && Number(price.replace(',', '.') >= 0)) {
                    const numericPrice = Number(price.replace(',', '.'));

                    const validPrice = numericPrice;

                    return validPrice;
                }

                _errors.salePrice = 'O preço deve estar no formato XX,XX e ser maior ou igual a 0';
                return false;
            }

            _errors.salePrice = 'A string de preço não pode conter a letra E/e';
            return false;
        }

        _errors.salePrice = 'O preço deve ser passado como uma string';
    },
};
