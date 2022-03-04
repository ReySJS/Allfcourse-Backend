// -----------------------------------------------------------------------------------------------//
// Archive: controllers/session/logout.controller.js
// Description: File responsible for the 'logout' function of the 'session' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

exports.logout = (req, res) => {
    res.status(202).clearCookie('auth').send({ message: 'Logout sucedido' });
};
