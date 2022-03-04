// -----------------------------------------------------------------------------------------------//
// Archive: routes/recovery.routes.js
// Description: File responsible for api routes related to 'recovery' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');

const router = express.Router();
const { forgotPassEmail } = require('@controller/recovery/forgotPassEmail.controller');
const { forgotPassSMS } = require('@controller/recovery/forgotPassSMS.controller');
const { checkpassToken } = require('@controller/recovery/checkResetPassToken.controller');
const { resetPass } = require('@controller/recovery/resetPass.controller');
const { newEmailToken } = require('@controller/recovery/newEmailToken.controller');

// ------------------------------------------------------------//
// -----------------------recovery-routes----------------------//
router.post('/requestpass-email', forgotPassEmail); // todos
router.post('/requestpass-sms', forgotPassSMS); // todos
router.post('/checkpasstoken', checkpassToken); // todos
router.post('/resetpass', resetPass); // todos
router.post('/newvalidate', newEmailToken); // todos
// -----------------------recovery-routes----------------------//
// ------------------------------------------------------------//

module.exports = router;
