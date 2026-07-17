const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");

module.exports = {
    showLogin: async (req, res) => {
        try {
            const alert = {};

            res.render("index", {
                title: "Isakha Rentals | Login",
                layout: "admin/layouts/auth",
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/login");
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username: username });

            if (!user) {
                req.flash("alertMessage", "User not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/login");
            }

            const checkPassword = await bcrypt.compare(password, user.password);

            if (!checkPassword) {
                req.flash("alertMessage", "Invalid Password");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/login");
            }

            req.session.user = {
                id: user._id,
                username: user.username,
            };

            res.redirect("/admin/dashboard");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/login");
        }
    },

    logout: async (req, res) => {
        req.session.destroy();

        res.redirect("admin/login");
    },
};
