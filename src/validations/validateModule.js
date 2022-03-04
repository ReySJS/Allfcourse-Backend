module.exports = {
    validateModule: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const moduleId = _id.trim();
            const eIndex = moduleId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(moduleId)) && Number(moduleId) > 0) {
                    const validmoduleId = Number(moduleId);

                    return validmoduleId;
                }

                _errors.moduleId = 'O ID deve ser um número, positivo e diferente de zero, "5"';
                return false;
            }

            _errors.moduleId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.moduleId = 'Você deve passar números como string';
        return false;
    },
};
