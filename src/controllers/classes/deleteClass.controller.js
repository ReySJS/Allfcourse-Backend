// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for delete a class from a course
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
const checkClass = require('@app/functions/checkIfClassExists');

exports.deleteClass = async (req, res) => {
    const classId = req.params.id.toString();
    const userType = req.auth.type;

    if (userType !== 1 || userType !== 4 || userType !== 6) {
        const check = await checkClass.check(classId);

        if (Object.keys(check.validationErrors).length !== 0
        || Object.keys(check.criticalErrors).length !== 0) {
            res.sendError(check, 500);
        } else {
            const classFirstColumns = ['id', 'module_id', 'class_order', 'deleted_at'];
            const whereFirstClass = {
                id: {
                    operator: '=',
                    value: check.id,
                },
            };
            const logicalOperatorsFirst = [''];

            const classFirstInformations = await query.Select(
                'classes',
                classFirstColumns,
                whereFirstClass,
                logicalOperatorsFirst,
            );
            const biggerOrderClasses = await query.Select(
                'classes',
                ['id'],
                {
                    module_id: {
                        operator: '=',
                        value: classFirstInformations.data[0].module_id,
                    },
                    class_order: {
                        operator: '>',
                        value: classFirstInformations.data[0].class_order,
                    },
                },
                ['AND'],
            );

            if (Array.isArray(biggerOrderClasses.data)) {
                if (Array.isArray(biggerOrderClasses.data) === 0) {
                    const now = new Date().toLocaleString();
                    const classColumns = {
                        deleted_at: {
                            value: now,
                            type: 'string',
                        },
                    };
                    const whereClass = {
                        id: {
                            operator: '=',
                            value: check.id,
                        },
                    };
                    const logicalOperators = [''];
                    const returning = ['id', 'module_id', 'class_order', 'deleted_at'];

                    const classInformations = await query.Update(
                        true,
                        'classes',
                        classColumns,
                        returning,
                        whereClass,
                        logicalOperators,
                    );

                    if (Array.isArray(classInformations.data)) {
                        if (classInformations.data.length > 0) {
                            res.status(200).send({ message: 'Aula excluída com sucesso!' });
                        } else {
                            res.sendError('Alguma coisa ocorreu errado', 500);
                        }
                    } else {
                        res.sendError(classInformations.error, 500);
                    }
                } else {
                    const now = new Date().toLocaleString();
                    const classColumns = {
                        deleted_at: {
                            value: now,
                            type: 'string',
                        },
                    };
                    const whereClass = {
                        id: {
                            operator: '=',
                            value: check.id,
                        },
                    };
                    const logicalOperators = [''];
                    const returning = ['id', 'module_id', 'class_order', 'deleted_at'];

                    const classInformations = await query.Update(
                        true,
                        'classes',
                        classColumns,
                        returning,
                        whereClass,
                        logicalOperators,
                    );

                    if (Array.isArray(classInformations.data)) {
                        if (classInformations.data.length > 0) {
                            const otherClassesColumns = {
                                class_order: {
                                    value: 'classes.class_order - 1',
                                    type: 'integer',
                                },
                            };

                            const whereOtherClasses = {
                                module_id: {
                                    operator: '=',
                                    value: classInformations.data[0].module_id,
                                },
                                class_order: {
                                    operator: '>',
                                    value: classInformations.data[0].class_order,
                                },
                                deleted_at: {
                                    operator: 'is',
                                    value: 'null',
                                },
                            };

                            const otherClassesLogicalOperators = ['AND', 'AND'];
                            const otherClassesReturning = ['id', 'class_order'];

                            const updatingOtherClasses = await query.Update(
                                true,
                                'classes',
                                otherClassesColumns,
                                otherClassesReturning,
                                whereOtherClasses,
                                otherClassesLogicalOperators,
                            );

                            if (Array.isArray(updatingOtherClasses.data)) {
                                res.status(200).send({ message: 'Aula excluída com sucesso!' });
                            } else {
                                const recoveringColumns = {
                                    deleted_at: {
                                        value: null,
                                    },
                                };

                                const whereRecovering = {
                                    id: {
                                        operator: '=',
                                        value: check.id,
                                    },
                                };

                                const recoveringLogicalOperators = [''];
                                const recoveringReturning = ['id', 'module_id', 'class_order', 'deleted_at'];

                                const recovering = await query.Update(
                                    true,
                                    'classes',
                                    recoveringColumns,
                                    recoveringReturning,
                                    whereRecovering,
                                    recoveringLogicalOperators,
                                );

                                if (Array.isArray(recovering.data)) {
                                    if (recovering.data.length > 0) {
                                        res.sendError({ message: 'Ocorreu um erro durante a atualização das aulas após a excluída e a exclusão foi desfeita!' }, 500);
                                    } else {
                                        res.sendError({ message: 'Ocorreu um erro durante a atualização das aulas após a excluída e durante a recu[eração da aula excluída!' }, 500);
                                    }
                                } else {
                                    res.sendError(recovering.error, 500);
                                }
                            }
                        } else {
                            res.sendError('Alguma coisa ocorreu errado', 500);
                        }
                    } else {
                        res.sendError(classInformations.error, 500);
                    }
                }
            } else {
                res.sendError(biggerOrderClasses.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
