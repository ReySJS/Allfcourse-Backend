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
const { getPaymentMethod } = require('@controller/payment-method/getPaymentMethod.controller');
const { deletePaymentMethod } = require('@controller/payment-method/deletePaymentMethod.controller');
const { updatePaymentMethod } = require('@controller/payment-method/updatePaymentMethod.controller');

// ------------------------------------------------------------//
// --------------------payment-method-routes-------------------//
router.post('/payment-methods', jwtuser, addPaymentMethod); // admin
router.get('/payment-methods/:id', jwtuser, getPaymentMethod);
router.delete('/payment-method/:id', jwtuser, deletePaymentMethod);
router.put('/updatepaymentmethod/:id', jwtuser, updatePaymentMethod);
// --------------------payment-method-routes-------------------//
// ------------------------------------------------------------//

module.exports = router;
