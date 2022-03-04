// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getcourse' function of the 'courses' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getcourse = async (req, res) => {
    const { id } = req.params;
    if (id === '0') {
        const checkSelect = ['*'];
        const categoryFound = await query.Select(
            'courses',
            checkSelect,
            [''],
            [''],
        );
        if (categoryFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum curso encontrado' });
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
            'courses',
            checkSelect,
            whereCheck,
            logicalOperators,
        );
        if (categoryFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum curso com este ID encontrado' });
        } else {
            res.status(200).send(categoryFound.data);
        }
    }
};
