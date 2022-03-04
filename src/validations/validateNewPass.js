module.exports = {
    validateToken: (token, _errors) => {
        if (typeof (token) === 'string') {
            return true;
        }
        _errors.tokenStringE = 'O Token deve ser uma string';
        return false;
    },
    validatePassword: (_password, _passwordagain, _errors) => {
        if (typeof (_password) === 'string') {
            if (_password.length >= 6) {
                if (_password === _passwordagain) {
                    return true;
                }
                _errors.passwordMatch = 'As senhas não conferem';
                return false;
            }

            _errors.passwordLength = 'A senha deve possuir no mínimo 6 caracteres';
            return false;
        }

        _errors.passwordString = 'A senha deve ser em formato string';
        return false;
    },
};
