module.exports = {
    validateClassId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const classId = _id.trim();
            const eIndex = classId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(classId)) && Number(classId) > 0) {
                    const validClassId = Number(classId);

                    return validClassId;
                }

                _errors.classId = 'O ID deve ser um número, positivo e maior que zero, por exemplo "5"';
                return false;
            }

            _errors.classId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.classId = 'Você deve passar números como string';
        return false;
    },
    validateClassModuleId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const moduleId = _id.trim();
            const eIndex = moduleId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(moduleId)) && Number(moduleId) > 0) {
                    const validModuleId = Number(moduleId);

                    return validModuleId;
                }

                _errors.moduleId = 'O ID deve ser um número, posirivo e maior que zero, por exemplo "5"';
                return false;
            }

            _errors.moduleId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.moduleId = 'Você deve passar números como string';
        return false;
    },
    validateClassOrder: (_order, _errors) => {
        if (typeof (_order) === 'string') {
            const classOrder = _order.trim();
            const eIndex = classOrder.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(classOrder)) && Number(classOrder) > 0) {
                    const validClassOrder = Number(classOrder);

                    return validClassOrder;
                }

                _errors.classOrder = 'O ID deve ser um número, positivo e maior que zero, por exemplo "5"';
                return false;
            }

            _errors.classOrder = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.classOrder = 'Você deve passar números como string';
        return false;
    },
    validateClassName: (_name, _errors) => {
        if (typeof (_name) === 'string') {
            const name = _name.trim();
            if (name.length >= 3 && name.length <= 80) {
                return name.toUpperCase();
            }

            _errors.courseName = `O nome da aula deve ter pelo menos 3 caracteres e ser menor que ou igual a 80 caracteres. O nome fornecido tem ${name.length} caracteres.`;
            return false;
        }

        _errors.courseName = 'O nome da aula deve ser uma string';
        return false;
    },
    validateClassInactive: (_inactive, _errors) => {
        const inactive = _inactive;

        if (typeof (inactive) === 'boolean') {
            return inactive;
        }

        _errors.classInactive = 'O valor deve ser booleano';
        return false;
    },
    validateClassVideoLink: (_link, _errors) => {
        if (typeof (_link) === 'string') {
            const link = _link.trim();
            if (link.length >= 10 && link.length <= 255) {
                const regexLink = /(https:\/\/youtu\.be\/)/;
                if (regexLink.test(link)) {
                    const linkCode = link.split('.be/')[1];
                    return linkCode;
                }
                _errors.classVideoLink = 'O link do vídeo da aula deve ter domínio https://youtu.be/';
                return false;
            }

            _errors.classVideoLink = `O link do vídeo da aula deve ter pelo menos 10 caracteres e ser menor que ou igual a 255 caracteres. O link fornecido tem ${link.length} caracteres.`;
            return false;
        }

        _errors.classVideoLink = 'O link do vídeo da aula deve ser uma string';
        return false;
    },
    validateClassDescription: (_description, _errors) => {
        if (typeof (_description) === 'string') {
            const description = _description.trim();

            if (description.length >= 3 && description.length <= 255) {
                const validDescription = description.toUpperCase();

                return validDescription;
            }

            _errors.classDescription = `A descrição da aula deve ter pelo menos 10 caracteres e ser menor que ou igual a 255 caracteres. A descrição fornecida tem ${description.length} caracteres.`;
            return false;
        }

        _errors.classDescription = 'A descrição da aula deve ser uma string';
        return false;
    },
};
