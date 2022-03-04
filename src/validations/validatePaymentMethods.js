module.exports = {
    validatePaymentMethodId: (_id, _errors) => {
        if (typeof (_id) === 'string') {
            const paymentMethodId = _id.trim();
            const eIndex = paymentMethodId.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(paymentMethodId)) && Number(paymentMethodId) > 0) {
                    const validPaymentMethodId = Number(paymentMethodId);

                    return validPaymentMethodId;
                }

                _errors.paymentMethodId = 'O número de parcelas deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.paymentMethodId = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.paymentMethodId = 'Você deve passar números como string';
        return false;
    },
    validatePaymentMethodName: (_name, _errors) => {
        if (typeof (_name) === 'string') {
            const name = _name.trim();
            if (name.length >= 3 && name.length <= 30) {
                const validName = name.toUpperCase();

                return validName;
            }

            _errors.paymentMethodName = `O nome do método de pagamento deve possuir pelo menos 3 caracteres e ser menor que ou igual a 30 caracteres. O nome fornecido tem ${name.length} caracteres.`;
        } else {
            _errors.paymentMethodName = 'O nome do método de pagamento deve ser uma string.';
            return false;
        }
    },
    validatePaymentMethodInstallments: (_installments, _errors) => {
        if (typeof (_installments) === 'string') {
            const paymentMethodInstallment = _installments.trim();
            const eIndex = paymentMethodInstallment.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(paymentMethodInstallment))
                    && Number(paymentMethodInstallment) > 0) {
                    const validInstallment = Number(paymentMethodInstallment);

                    return validInstallment;
                }

                _errors.paymentMethodInstallment = 'O id deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.paymentMethodInstallment = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.paymentMethodInstallment = 'Você deve passar números como string';
        return false;
    },
};
