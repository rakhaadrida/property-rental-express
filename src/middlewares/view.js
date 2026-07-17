const user = (req, res, next) => {
    res.locals.username = null;

    if (req.session.user) {
        res.locals.username = req.session.user.username;
    }

    next();
};

module.exports = user;
