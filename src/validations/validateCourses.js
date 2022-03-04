module.exports = {
    validateCourseId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const courseId = _id.trim();
            const eIndex = courseId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(courseId)) && Number(courseId) > 0) {
                    const validateCourseId = Number(courseId);

                    return validateCourseId;
                }

                _errors.courseId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.courseId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.courseId = 'Você deve passar números como string';
        return false;
    },
    validateCourseName: (_name, _errors) => {
        if (typeof (_name) === 'string') {
            const name = _name.trim();
            if (name.length >= 3 && name.length <= 80 && typeof (name) === 'string') {
                const validName = name.toUpperCase();

                return validName;
            }

            _errors.courseName = `O nome do curso deve ter pelo menos 3 e ser menor que ou igual a 80 caracteres. O nome fornecido tem ${name.length} caracteres.`;
            return false;
        }

        _errors.courseName = 'O nome do curso deve ser uma string';
        return false;
    },
    validateCourseTeacherId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const teacherId = _id.trim();
            const eIndex = teacherId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(teacherId)) && Number(teacherId) > 0) {
                    const validTeacherId = Number(teacherId);

                    return validTeacherId;
                }

                _errors.courseTeacherId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.courseTeacherId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        // throw new Error("You should pass numbers as a string");
        _errors.courseTeacherId = 'Você deve passar números como string';
        return false;
    },
    validateCourseDescription: (_description, _errors) => {
        if (typeof (_description) === 'string') {
            const description = _description.trim().toUpperCase();

            return description;
        }

        _errors.courseDescription = 'A descrição do curso deve ser uma string';
        return false;
    },
    validateCoursePrice: (_price, _errors) => {
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

                _errors.coursePrice = 'O preço deve estar no formato XX,XX e ser maior ou igual a 0';
                return false;
            }

            _errors.coursePrice = 'A string de preço não pode conter a letra E/e';
            return false;
        }

        _errors.coursePrice = 'O preço deve ser passado como uma string';
    },
    validateCourseStatus: (_status, _errors) => {
        const regex = /em análise$|aprovado$|rejeitado$|inativo$/i;

        if (typeof (_status) === 'string') {
            const status = _status.trim();

            if (regex.test(status)) {
                return true;
            }

            _errors.reqRefundStatus = 'O status do curso deve ser um dos seguintes: em análise, aprovado, rejeitado, inativo';
        } else {
            _errors.reqRefundStatus = 'O status do curso deve ser uma string';
            return false;
        }
    },
};
