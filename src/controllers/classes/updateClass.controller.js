// -----------------------------------------------------------------------------------------------//
// Archive: controllers/course-categories/addCourseCategory.controller.js
// Description: File responsible for the 'updateClass' function of the 'classes'
//  class controller
// Data: 2021/08/31
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const validateClassInformations = require('@validations/validateClasses');
const checkClass = require('@functions/checkIfClassExists');

exports.updateClass = async (req, res) => {
    const userType = req.auth.type;
    if (userType !== 1 || userType !== 4 || userType !== 5) {
        const { videoLink } = req.body;
        const { name } = req.body;
        const { description } = req.body;
        const { id } = req.params;
        const errors = { criticalErrors: {}, validationErrors: {} };

        const validLink = validateClassInformations.validateClassVideoLink(
            videoLink,
            errors.validationErrors,
        );

        const validName = validateClassInformations.validateClassName(
            name,
            errors.validationErrors,
        );

        const validDescription = validateClassInformations.validateClassDescription(
            description,
            errors.validationErrors,
        );

        if (Object.keys(errors.criticalErrors).length > 0
            || Object.keys(errors.validationErrors).length > 0) {
            res.sendError(errors, 500);
        } else {
            const check = await checkClass.check(id);

            if (Object.keys(check.criticalErrors).length > 0
                || Object.keys(check.validationErrors).length > 0) {
                res.sendError(check, 500);
            } else {
                const updateColumns = {
                    video_link: {
                        value: validLink,
                        type: 'string',
                    },
                    name: {
                        value: validName,
                        type: 'string',
                    },
                    description: {
                        value: validDescription,
                        type: 'string',
                    },
                };

                const updateWhere = {
                    id: {
                        operator: '=',
                        value: check.id,
                    },
                };

                const logicalOperators = [];

                const returning = [
                    'id',
                    'name',
                    'description',
                    'video_link',
                ];

                const updatingClass = await query.Update(
                    true,
                    'classes',
                    updateColumns,
                    returning,
                    updateWhere,
                    logicalOperators,
                );

                if (Array.isArray(updatingClass.data)) {
                    if (updatingClass.data.length > 0) {
                        res.status(200).send({ message: 'Aula atualizada com sucesso!' });
                    } else {
                        res.sendError('Alguma coisa ocorreu errado durante a atualização da aula', 500);
                    }
                } else {
                    res.sendError(updatingClass.error, 500);
                }
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
