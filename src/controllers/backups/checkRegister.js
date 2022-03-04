/* eslint-disable no-unused-vars */
const query = require('@helpers/Query');
const validateRegister = require('@validations/validateRegister');
require('dotenv').config();

async function check(
    document,
    email,
    phone,
    firstname,
    lastname,
    gender,
    birthdate,
) {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const validDocument = validateRegister.validateDocument(
        document,
        errors.validationErrors,
    );
    const validEmail = validateRegister.validateEmail(email, errors);
    const validFirstName = validateRegister.validateFirstName(
        firstname,
        errors.validationErrors,
    );
    const validLastName = validateRegister.validateLastName(
        lastname,
        errors.validationErrors,
    );
    const validGender = validateRegister.validateGender(
        gender,
        errors.validationErrors,
    );
    const validPhone = validateRegister.validatePhone(
        phone,
        errors.validationErrors,
    );
    const validbirthDate = validateRegister.validateBirthDate(
        birthdate,
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
            value: document,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck2 = {
        email: {
            operator: '=',
            value: email,
        },
        deleted_at: {
            operator: 'is',
            value: null,
        },
    };
    const whereCheck3 = {
        phone: {
            operator: '=',
            value: parseInt(phone, 10),
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
        || Array.isArray(check2.data)
        || Array.isArray(check3.data)
    ) {
        if (check1.data.length >= 1 && check2.data.length >= 1 && check3.data.length >= 1) {
            errors.criticalErrors.documentemailphone = {
                message: 'Documento, e-mail e telefone já existem',
                code: 500,
            };
            return errors;
        }
        if (check1.data.length >= 1) {
            if (check2.data.length >= 1) {
                errors.criticalErrors.documentemail = {
                    message: 'Documento e e-mail já existem',
                    code: 500,
                };
                return errors;
            }
            if (check3.data.length >= 1) {
                errors.criticalErrors.documentphone = {
                    message: 'Documento e telefone já existem',
                    code: 500,
                };
                return errors;
            }
            errors.criticalErrors.document = {
                message: 'Documento já existe',
                code: 500,
            };
            return errors;
        }
        if (check2.data.length >= 1) {
            if (check3.data.length >= 1) {
                errors.criticalErrors.emailphone = {
                    message: 'Email e telefone já existem',
                    code: 500,
                };
                return errors;
            }
            errors.criticalErrors.email = {
                message: 'E-mail já existe',
                code: 500,
            };
            return errors;
        }
        if (check3.data.length >= 1) {
            errors.criticalErrors.phone = {
                message: 'Telefone já existe',
                code: 500,
            };
            return errors;
        }
        return true;
    }

    return [check1, 500];
}

module.exports = { check };
