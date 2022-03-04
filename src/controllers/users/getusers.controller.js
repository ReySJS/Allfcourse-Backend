// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/login.controller.js
// Description: File responsible for the 'getuser' function of the 'users' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('dotenv').config();
const query = require('@helpers/Query');

exports.getuser = async (req, res) => {
    const { id } = req.params;
    if (id === '0') {
        const checkSelect = ['*'];
        const userFound = await query.Select(
            'users',
            checkSelect,
            [''],
            [''],
        );
        if (userFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum usuário cadastrado' });
        } else {
            res.status(200).send(userFound.data);
        }
    } else {
        const checkSelect = ['*'];
        const whereCheck = {
            id: {
                operator: '=',
                value: id,
            },
        };
        const userFound = await query.Select(
            'users',
            checkSelect,
            whereCheck,
            [''],
        );
        if (userFound.data.length < 1) {
            res.status(404).send({ message: 'Nenhum usuário com este ID encontrado' });
        } else {
            res.status(200).send(userFound.data);
        }
    }
};
