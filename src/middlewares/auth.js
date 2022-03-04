const fs = require('fs');
const jwt = require('@model/jwt');

//  ----------------------------------------------------------------------------
//  --------------------Middleware to user authentication-----------------------
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth;
    try {
        const payload = await jwt.verify(token);

        req.auth = {
            id: payload.id,
            email: payload.email,
            firstname: payload.name,
            type: payload.type,
            photo: payload.photo,
        };

        console.table({ 'Session-user': req.auth });

        next();
    } catch (error) {
        fs.readFile('./logs/data.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const buffer = JSON.parse(data);
                buffer.push(error);
                // eslint-disable-next-line no-unused-vars
                fs.writeFile('./logs/data.json', JSON.stringify(buffer), (err) => {
                    // console.log(err);
                });
            }
        });
        res.cookie('auth').status(401).send('Falha na autenticação do usuário');
    }
};
// --------------------Middleware to user authentication-----------------------
// ----------------------------------------------------------------------------
module.exports = authMiddleware;
