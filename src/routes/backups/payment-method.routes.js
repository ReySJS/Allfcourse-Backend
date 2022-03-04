// -----------------------------------------------------------------------------------------------//
// Archive: routes/payment-method.routes.js
// Description: File responsible for api routes related to 'payment method' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addPaymentMethod } = require('@controller/payment-method/addPaymentMethod.controller');

// ------------------------------------------------------------//
// --------------------payment-method-routes-------------------//
router.post('/payment-methods', jwtuser, addPaymentMethod); // admin
// --------------------payment-method-routes-------------------//
// ------------------------------------------------------------//

module.exports = router;
