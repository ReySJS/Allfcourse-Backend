// -----------------------------------------------------------------------------------------------//
// Archive: routes/payment-method.routes.js
// Description: File responsible for api routes related to 'classes' class
// Data: 2021/08/30
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { deleteEnrollStudent } = require('@app/controllers/users/deleteEnrollStudents.controller');

// ------------------------------------------------------------//
// --------------------classes-routes-------------------//
router.delete('/enroll-students/:id', jwtuser, deleteEnrollStudent);
// --------------------classes-routes-------------------//
// ------------------------------------------------------------//

module.exports = router;
