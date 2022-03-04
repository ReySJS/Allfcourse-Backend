// -----------------------------------------------------------------------------------------------//
// Archive: routes/sales.routes.js
// Description: File responsible for api routes related to 'sales' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addSale } = require('@controller/sales/addSale.controller');
const { getSalesByCourseId } = require('@app/controllers/sales/getSalesByCourseId.controller');
const { getSales } = require('@app/controllers/sales/getSale.controller');
const { getSalesByStudentId } = require('@app/controllers/sales/getSalesByStudentId.controller');

// ------------------------------------------------------------//
// -------------------------sales-routes-----------------------//
router.post('/buy', jwtuser, addSale); // aluno, professor
router.get('/sales/course/:id', jwtuser, getSalesByCourseId);
router.get('/sales/student/:id', getSalesByStudentId);
router.get('/sales/:id', jwtuser, getSales);
// -------------------------sales-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
