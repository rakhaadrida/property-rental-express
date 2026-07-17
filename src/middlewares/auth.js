const authenticate = (req, res, next) => {
    if (!req.session.user) {
        req.flash("alertMessage", "Your session has been expired");
        req.flash("alertStatus", "danger");

        res.redirect("/admin/login");
    }

    next();
};

const isGuest = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/admin/dashboard");
    }

    next();
};

module.exports = { authenticate, isGuest };
