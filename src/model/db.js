require('dotenv').config();
require('module-alias/register');
const config = require('@config');

const sqlconnect = {
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
    ssl: { rejectUnauthorized: false },
    sslfactory: process.env.DB_SSLFAC,
};

module.exports = { sqlconnect };
