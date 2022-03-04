// -----------------------------------------------------------------------------------------------//
// Archive: controllers/payment-method/addPaymentMethod.controller.js
// Description: File responsible for the 'validateCourse' function of the 'courses'
//  class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');

exports.validateCourse = async (req, res) => {
    const { type } = req.auth;
    console.log(req.auth);
    if (type === 4 || type === 5 || type === 7 || type === 6) {
        const { id } = req.body;
        const { status } = req.body;

        const checkSelect = ['*'];
        const whereCheck = {
            id: {
                operator: '=',
                value: id,
            },
            deleted_at: {
                operator: 'is',
                value: null,
            },
        };
        const selectLogicalOperators = ['AND'];
        const courseFound = await query.Select(
            'courses',
            checkSelect,
            whereCheck,
            selectLogicalOperators,
        );

        if (courseFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum Curso com este ID encontrado' });
        } else if (status !== 'aprovado' && status !== 'em análise' && status !== 'rejeitado' && status !== 'inativo') {
            res.status(400).send({ message: 'Valor inválido, valores válidos: "aprovado", "em análise", "negado"' });
        } else {
            const whereColumns = {
                id: {
                    operator: '=',
                    value: courseFound.data[0].id,
                },
            };
            const fieldsValues = {};
            fieldsValues.status = {
                value: status,
                type: 'string',
            };

            const result = await query.Update(
                true,
                'courses',
                fieldsValues,
                ['*'],
                whereColumns,
                [''],
            );

            if (Array.isArray(result.data)) {
                res.status(201).send({ message: `Curso atualizado para o status: ${status}` });
            } else {
                res.sendError(result.error, 500);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
