// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getcategory' function of the 'courses-categories' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getcategory = async (req, res) => {
    const { id } = req.params;
    const { type } = req.auth;
    if (type === 4 || type === 5 || type === 7 || type === 6 || type === 2 || type === 3) {
        if (id === '0') {
            const checkSelect = ['*'];
            const whereCheck = {
                deleted_at: {
                    operator: 'is',
                    value: 'null',
                },
            };
            const categoryFound = await query.Select(
                'courses_categories',
                checkSelect,
                whereCheck,
                [''],
            );
            if (categoryFound.data.length < 1) {
                res.status(404).send({ message: 'Nenhuma categoria encontrada' });
            } else {
                res.status(200).send(categoryFound.data);
            }
        } else {
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
            const categoryFound = await query.Select(
                'courses_categories',
                checkSelect,
                whereCheck,
                logicalOperators,
            );
            if (categoryFound.data.length < 1) {
                res.status(404).send({ message: 'Nenhuma categoria com este ID encontrado' });
            } else {
                res.status(200).send(categoryFound.data);
            }
        }
    } else {
        res.status(401).send({ message: 'Não autorizado' });
    }
};
