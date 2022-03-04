// -----------------------------------------------------------------------------------------------//
// Archive: routes/courses.routes.js
// Description: File responsible for api routes related to 'receive-bills' class
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const { getReceiveBills } = require('@controller/receive-bills/getReceiveBills.controller');
const { getReceiveBillsBySale } = require('@controller/receive-bills/getReceiveBillsBySale.controller');

const router = express.Router();
// ------------------------------------------------------------//
// -----------------------receive-bills-routes-----------------------//
router.get('/receive-bills/:id', jwtuser, getReceiveBills);
router.get('/receive-bills/sale/:id', getReceiveBillsBySale);

// -----------------------receive-bills-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
