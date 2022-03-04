// -----------------------------------------------------------------------------------------------//
// Archive: routes/login.routes.js
// Description: File responsible for api routes related to 'session' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { login } = require('@controller/session/login.controller');
const { logout } = require('@controller/session/logout.controller');

// ------------------------------------------------------------//
// -----------------------session-routes-----------------------//
router.post('/login', login);
router.post('/logout', logout);
// -----------------------session-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
