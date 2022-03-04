// -----------------------------------------------------------------------------------------------//
// Archive: routes/index.routes.js
// Description: File responsible for loading all routes
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

require('module-alias/register');
// const jwtuser = require('@middlewares/auth');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ------------------------------------------------------------//
// ------------------------general-routes----------------------//
app.use(require('./session.routes'));

// app.use(jwtuser);

app.use(require('./users.routes'));
app.use(require('./recovery.routes'));
app.use(require('./sales.routes'));
app.use(require('./courses.routes'));
app.use(require('./course-categories.routes'));
app.use(require('./payment-method.routes'));
// app.use(require('./course-modules.routes'));
// app.use(require('./course-classes.routes'));
// ------------------------general-routes----------------------//
// ------------------------------------------------------------//

module.exports = app;
