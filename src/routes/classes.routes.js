// -----------------------------------------------------------------------------------------------//
// Archive: routes/payment-method.routes.js
// Description: File responsible for api routes related to 'classes' class
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { deleteClass } = require('@controller/classes/deleteClass.controller');

// ------------------------------------------------------------//
// --------------------classes-routes-------------------//
router.delete('/class/:id', jwtuser, deleteClass);
// --------------------classes-routes-------------------//
// ------------------------------------------------------------//

module.exports = router;
