/* eslint-disable no-unused-vars */
const query = require('@helpers/Query');
const validateRegister = require('@validations/validateRegister');
require('dotenv').config();

async function check(
    _document,
    _email,
    _phone,
    _firstname,
    _lastname,
    _gender,
    _birthdate,
    _password,
    _usertype,
    _socialname,
) {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const validDocument = validateRegister.validateDocument(
        _document,
        errors.validationErrors,
    );
    const validEmail = validateRegister.validateEmail(_email, errors);
    const validFirstName = validateRegister.validateFirstName(
        _firstname,
        errors.validationErrors,
    );
    const validLastName = validateRegister.validateLastName(
        _lastname,
        errors.validationErrors,
    );
    const validGender = validateRegister.validateGender(
        _gender,
        errors.validationErrors,
    );
    const validPhone = validateRegister.validatePhone(
        _phone,
        errors.validationErrors,
    );
    const validbirthDate = validateRegister.validateBirthDate(
        _birthdate,
        errors.validationErrors,
    );

    const validPassword = validateRegister.validatePassword(
        _password,
        errors.validationErrors,
    );

    let validSocialName = null;

    if (_socialname) {
        validSocialName = validateRegister.validateSocialName(
            _socialname,
            errors.validationErrors,
        );
    }

    const validUserType = validateRegister.validateUserType(
        _usertype,
        errors.validationErrors,
    );

    if (Object.keys(errors.validationErrors).length > 0) {
        return errors;
    }

    const checkSelect1 = ['document'];
    const checkSelect2 = ['email'];
    const checkSelect3 = ['phone'];
    const whereCheck1 = {
        document: {
            operator: '=',
            value: _document,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck2 = {
        email: {
            operator: '=',
            value: _email,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck3 = {
        phone: {
            operator: '=',
            value: parseInt(_phone, 10),
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const checkOperators = ['AND'];
    const check1 = await query.Select(
        'users',
        checkSelect1,
        whereCheck1,
        checkOperators,
    );

    const check2 = await query.Select(
        'users',
        checkSelect2,
        whereCheck2,
        checkOperators,
    );

    const check3 = await query.Select(
        'users',
        checkSelect3,
        whereCheck3,
        checkOperators,
    );
    if (
        Array.isArray(check1.data)
        && Array.isArray(check2.data)
        && Array.isArray(check3.data)
    ) {
        if (check1.data.length >= 1 && check2.data.length >= 1 && check3.data.length >= 1) {
            errors.validationErrors.documentemailphone = {
                message: 'Documento, e-mail e telefone já existem',
                code: 500,
            };
            return errors;
        }
        if (check1.data.length >= 1) {
            if (check2.data.length >= 1) {
                errors.validationErrors.documentemail = {
                    message: 'Documento e e-mail já existem',
                    code: 500,
                };
                return errors;
            }
            if (check3.data.length >= 1) {
                errors.validationErrors.documentphone = {
                    message: 'Documento e telefone já existem',
                    code: 500,
                };
                return errors;
            }
            errors.validationErrors.document = {
                message: 'Documento já existe',
                code: 500,
            };
            return errors;
        }
        if (check2.data.length >= 1) {
            if (check3.data.length >= 1) {
                errors.validationErrors.emailphone = {
                    message: 'Email e telefone já existem',
                    code: 500,
                };
                return errors;
            }
            errors.validationErrors.email = {
                message: 'E-mail já existe',
                code: 500,
            };
            return errors;
        }
        if (check3.data.length >= 1) {
            errors.validationErrors.phone = {
                message: 'Telefone já existe',
                code: 500,
            };
            return errors;
        }

        return {
            document: validDocument,
            email: validEmail,
            firstName: validFirstName,
            lastName: validLastName,
            socialName: validSocialName,
            gender: validGender,
            phone: validPhone,
            birthDate: validbirthDate,
            password: validPassword,
            type: validUserType,
            validationErrors: { ...errors.validationErrors },
            criticalErrors: { ...errors.criticalErrors },
        };
    }

    errors.criticalErrors.document = {
        message: 'Ocorreu um erro inesperado durante a consulta de documentos',
        code: 500,
        detail: { ...check1.error },
    };
    errors.criticalErrors.email = {
        message: 'Ocorreu um erro inesperado durante a consulta de emails',
        code: 500,
        detail: { ...check2.error },
    };
    errors.criticalErrors.phone = {
        message: 'Ocorreu um erro inesperado durante a consulta de telefones',
        code: 500,
        detail: { ...check3.error },
    };
    return errors;
}

module.exports = { check };
