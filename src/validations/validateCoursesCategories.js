module.exports = {
    validateCategoryId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const categoryId = _id.trim();
            const eIndex = categoryId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(categoryId)) && Number(categoryId) > 0) {
                    const validCategoryId = Number(categoryId);

                    return validCategoryId;
                }

                _errors.categoryId = 'O ID deve ser um número, positivo e diferente de zero, "5"';
                return false;
            }

            _errors.categoryId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.categoryId = 'Você deve passar números como string';
        return false;
    },
    validateCategoryName: (_name, _errors) => {
        if (typeof _name === 'string') {
            const name = _name.trim();

            if (name.length >= 3 && name.length <= 30 && typeof (name) === 'string') {
                const validName = name.toUpperCase();

                return validName;
            }

            _errors.categoryName = `O nome da categoria deve ser uma string com pelo menos 3 caracteres e ser menor ou igual a 30 caracteres. O nome fornecido tem ${name.length} caracteres.`;
            return false;
        }

        _errors.categoryName = 'O nome da categoria deve ser uma string.';
        return false;
    },
};
