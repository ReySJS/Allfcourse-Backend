module.exports = {
    validateDocument: (_document, _errors) => {
        const document = _document.trim();
        const regex = /\d{3}\.\d{3}\.\d{3}-\d{2}$||\d{11}/;

        if (typeof (document) === 'string' && regex.test(document) && _document.length === 11) {
            const eIndex = document.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(Number(document)) && _document.length === 11) {
                    const strCPF = _document.trim().replace(/[^\d]+/g, '');

                    let sum;
                    let rest;
                    sum = 0;

                    if (strCPF === '00000000000') {
                        _errors.cpf = 'CPF Inválido';
                        return false;
                    }

                    for (let i = 1; i <= 9; i++) {
                        sum += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
                    }

                    rest = (sum * 10) % 11;
                    if ((rest === 10) || (rest === 11)) {
                        rest = 0;
                    }

                    if (rest !== parseInt(strCPF.substring(9, 10), 10)) {
                        _errors.cpf = 'CPF Inválido';
                        return false;
                    }

                    sum = 0;
                    for (let i = 1; i <= 10; i++) {
                        sum += parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
                    }

                    rest = (sum * 10) % 11;
                    if ((rest === 10) || (rest === 11)) {
                        rest = 0;
                    }

                    if (rest !== parseInt(strCPF.substring(10, 11), 10)) {
                        _errors.cpf = 'CPF Inválido';
                        return false;
                    }

                    return document;
                }
                _errors.documentInvalid = 'O documento é inválido';
                return false;
                // return true;
            }

            _errors.documentStringE = 'O documento não pode conter a letra E';
            return false;
        }

        _errors.documentPattern = 'O Documento deve ser um número positivo e possuir 11 caracteres';
        return false;
    },
    validateEmail: (_email, _errors) => {
        const regexEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

        if (!_email.match(regexEmail)) {
            _errors.documentEmailFormat = 'E-mail em formato inválido';
            return false;
        }
        return _email;
    },
    validateFirstName: (_firstname, _errors) => {
        if (typeof (_firstname) === 'string') {
            if (_firstname.trim()) {
                const firstName = _firstname.trim();
                if (firstName.length <= 80 && firstName.length >= 3) {
                    return firstName.toUpperCase();
                }
                _errors.firstNameLength = `O primeiro nome deve possuir pelo menos 3 caracteres e ser menor que ou igual a 80 caracteres. O nome fornecido tem ${firstName.length} caracteres`;
                return false;
            }
            _errors.firstNameOnlySpaces = 'O primeiro nome não pode ser composto apenas de caracteres de espaço';
            return false;
        }
        _errors.firstNameString = 'O primeiro nome deve ser uma string';
        return false;
    },
    validateLastName: (_lastname, _errors) => {
        if (typeof (_lastname) === 'string') {
            if (_lastname.trim()) {
                const lastName = _lastname.trim();
                if (lastName.length <= 80 && lastName.length >= 3) {
                    return lastName.toUpperCase();
                }
                _errors.lastNameLength = `O último' nome deve possuir pelo menos 3 caracteres e ser menor que ou igual a 80 caracteres. O nome fornecido tem ${lastName.length} caracteres`;
                return false;
            }
            _errors.lastNameOnlySpaces = 'O último nome não pode ser composto apenas de caracteres de espaço';
            return false;
        }
        _errors.lastNameString = 'O último nome deve ser uma string';
        return false;
    },
    validateGender: (_gender, _errors) => {
        if (typeof (_gender) === 'string') {
            return _gender.toUpperCase();
        }
        _errors.genderString = 'O gênero deve ser uma string';
        return false;
    },
    validatePhone: (_phone, _errors) => {
        const phone = _phone.trim();

        if (typeof (phone) === 'string') {
            const eIndex = phone.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(phone)) && phone.length === 11) {
                    return phone;
                }

                _errors.phonePattern = 'O telefone deve ser númerico e possuir 11 caracteres';
                return false;
            }

            _errors.phoneStringE = 'O telefone não pode possuir a letra E';
            return false;
        }

        _errors.phoneString = 'O número deve ser passado como string';
        return false;
    },
    validateBirthDate: (_date, _errors) => {
        const date = _date.trim();
        const regex = /\d{4}-\d{2}-\d{2}$/;

        if (regex.test(date)) {
            function validDate(_date) {
                const date = _date.split('-');

                const day = date[2];
                const month = date[1];
                const year = date[0];

                switch (parseInt(month, 10)) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    if (day > 31 || day < 1) {
                        return false;
                    }
                    return true;

                case 4:
                case 6:
                case 9:
                case 11:
                    if (day > 30 || day < 1) {
                        return false;
                    }
                    return true;

                case 2:
                    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                        if (day > 29 || day < 1) {
                            return false;
                        }
                        return true;
                    }
                    if (day > 28 || day < 1) {
                        return false;
                    }
                    return true;

                default:
                    return false;
                }
            }

            if (validDate(date)) {
                return date;
            }
            _errors.date = 'Data inválida';
            return false;
        }
        _errors.date = 'A data deve estar no formato YYYY-MM-DD';
        return false;
    },
    validateSocialName: (_socialname, _errors) => {
        if (typeof (_socialname) === 'string') {
            if (_socialname.trim()) {
                const socialName = _socialname.trim();
                if (socialName.length <= 30 && socialName.length >= 3) {
                    return socialName.toUpperCase();
                }
                _errors.firstNameLength = `O nome social deve possuir pelo menos 3 caracteres e ser menor que ou igual a 30 caracteres. O nome fornecido tem ${socialName.length} caracteres`;
                return false;
            }
            _errors.firstNameOnlySpaces = 'O nome social não pode ser composto apenas de caracteres de espaço';
            return false;
        }
        _errors.firstNameString = 'O nome social deve ser uma string';
        return false;
    },
    validatePassword: (_password, _errors) => {
        const password = _password;

        if (typeof (password) === 'string') {
            if (password.length <= 20 && password.length >= 6) {
                return password;
            }
            _errors.passwordLength = `A senha deve possuir pelo menos 6 caracteres e ser menor que ou igual a 20 caracteres. A senha fornecida tem ${password.length} caracteres`;
            return false;
        }
        _errors.passwordString = 'A senha deve ser uma string';
        return false;
    },
    validateUserType: (_type, _errors) => {
        if (typeof (_type) === 'string') {
            const type = _type.trim();
            const eIndex = type.toLowerCase().indexOf('e');

            if (eIndex === -1) {
                if (!Number.isNaN(Number(type)) && Number(type) > 0) {
                    const numberType = Number(type);
                    if (numberType >= 1 && numberType <= 7) {
                        return numberType;
                    }
                    _errors.type = 'O tipo deve ser um número entre 1 e 7';
                    return false;
                }

                _errors.type = 'O tipo deve ser um número, positivo e diferente de zero, por exemplo "5"';
                return false;
            }

            _errors.type = 'A string numérica não pode conter a letra E/e';
            return false;
        }

        _errors.type = 'Você deve passar números como string';
        return false;
    },
};
