require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    jwt.verify(req.cookies.usertoken, process.env.SECRET, (err) => {
        if (err) {
            console.log(`${err.name}: ${err.message}`);
            return res.status(401).send({ message: 'Não autorizado' });
        }
        next();
    });
};

module.exports = { verifyToken };
