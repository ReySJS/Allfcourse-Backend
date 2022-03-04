module.exports = (req, res, next) => {
    res.sendError = function (message, status = 500) {
        return this
            .status(status)
            .send({ message });
    };
    next();
};
