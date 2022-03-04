// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'addCourseCategory' function of the 'course categories'
//  class controller
// Data: 2021/09/01
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
// const db = require('@model/db2');
const checkIfModuleExists = require('@functions/checkIfModuleExists');

exports.updateModule = async (req, res) => {
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        // const errors = { criticalErrors: {}, validationErrors: {} };
        const { id } = req.params;
        const { name } = req.body;
        const { description } = req.body;

        if (!name && !description) {
            res.send({
                message:
                    'Você deve informar pelo menos um dado para atualizar o módulo.',
            });
        } else {
            const check = await checkIfModuleExists.check(id);
            if (
                Object.keys(check.validationErrors).length === 0
                && Object.keys(check.criticalErrors).length === 0
            ) {
                const logicalOperators = ['AND'];
                const checkSelect = ['*'];
                const whereCheck = {
                    id: {
                        operator: '=',
                        value: id,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                };
                const currentModule = await query.Select(
                    'modules',
                    checkSelect,
                    whereCheck,
                    logicalOperators,
                );

                const fieldsValues = {};
                fieldsValues.name = {
                    value: name,
                    type: 'string',
                } || { value: currentModule.data[0].name, type: 'string' };

                fieldsValues.description = {
                    value: description,
                    type: 'string',
                } || { value: currentModule.data[0].description, type: 'string' };

                const whereColumns = {
                    id: {
                        operator: '=',
                        value: id,
                    },
                    deleted_at: {
                        operator: 'is',
                        value: 'null',
                    },
                };
                const updateLogicalOperators = ['AND'];

                const result = await query.Update(
                    true,
                    'modules',
                    fieldsValues,
                    ['*'],
                    whereColumns,
                    updateLogicalOperators,
                );
                if (Array.isArray(result.data)) {
                    res.status(201).send({
                        message:
                            'Módulo Atualizado com sucesso!',
                    });
                } else {
                    res.sendError(result.error, 500);
                }
            } else {
                res.sendError(check, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
