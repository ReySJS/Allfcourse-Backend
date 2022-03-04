module.exports = {
    validateModuleId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const moduleId = _id.trim();
            const eIndex = moduleId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(moduleId)) && Number(moduleId) > 0) {
                    const validModuleId = Number(moduleId);

                    return validModuleId;
                }

                _errors.moduleId = 'O ID deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.moduleId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.moduleId = 'Você deve passar números como string';
        return false;
    },
    validateModuleName: (_name, _errors) => {
        if (typeof (_name) === 'string') {
            const name = _name.trim();

            if (name.length >= 3 && name.length <= 80) {
                const validName = name.toUpperCase();

                return validName;
            }

            _errors.moduleName = `O nome do módulo deve ter pelo menos 3 caracteres e ser menor que ou igual a 80 caracteres. O nome fornecido tem ${name.length} caracteres.`;
            return false;
        }

        _errors.moduleName = 'O nome do módulo deve ser uma string';
        return false;
    },
    validateModuleDescription: (_description, _errors) => {
        if (typeof (_description) === 'string') {
            const description = _description.trim().toLocaleUpperCase();

            return description;
        }

        _errors.moduleDescription = 'A descrição do módulo deve ser uma string';
        return false;
    },
};
