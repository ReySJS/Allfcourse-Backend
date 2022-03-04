// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'financial-transfers' class
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const { getFinancialTransfersByTeacher } = require('@controller/financial-transfers/getFinancialTransfersByTeacher.controller');

const router = express.Router();
// ------------------------------------------------------------//
// -----------------------financial-transfers-routes-----------------------//
router.get('/financial-transfers/teacher/:id', jwtuser, getFinancialTransfersByTeacher); // todos

// -----------------------financial-transfers-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
