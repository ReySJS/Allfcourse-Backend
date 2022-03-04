// -----------------------------------------------------------------------------------------------//
// Archive: routes/users.routes.js
// Description: File responsible for api routes related to 'users' class
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const express = require('express');
const jwtuser = require('@middlewares/auth');

const router = express.Router();
const { addUser } = require('@controller/users/register.controller');
const { validateAccount } = require('@controller/users/validAccount.controller');
const { getuser } = require('@controller/users/getusers.controller');
const { getstudent } = require('@controller/users/getEnrollStudentsController');
const { deleteuser } = require('@controller/users/deleteUser.controller');
const { updatephoto } = require('@controller/users/updateProfilePhoto.controller');
const { updateUserData } = require('@controller/users/updateUserdata.controller');
const { updateUserPassword } = require('@controller/users/updatePassword.controller');
const { getCourseList } = require('@controller/users/getCourseList.controller');
// ------------------------------------------------------------//
// -------------------------users-routes-----------------------//
router.post('/register', addUser);
router.post('/validate', validateAccount);
router.get('/user/:id', jwtuser, getuser); // admin, usuário
router.get('/getstudent/:courseid', jwtuser, getstudent); // todos
router.delete('/deleteuser/:id', jwtuser, deleteuser);
router.put('/updatephoto', jwtuser, updatephoto);
router.put('/update-userdata', jwtuser, updateUserData);
router.put('/update-password', jwtuser, updateUserPassword);
router.get('/course-list', jwtuser, getCourseList);
// -------------------------users-routes-----------------------//
// ------------------------------------------------------------//

module.exports = router;
