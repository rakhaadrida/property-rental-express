const Category = require("../../models/category.model");

module.exports = {
    category: async (req, res) => {
        try {
            const category = await Category.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/category/category", {
                title: "Isakha Rentals | Category",
                category,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/categories");
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({ name });

            req.flash("alertMessage", "Success Add Category");
            req.flash("alertStatus", "success");

            res.redirect("/admin/categories");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/categories");
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.findByIdAndUpdate(
                req.params.id,
                { name },
                {
                    runValidators: true,
                },
            );

            req.flash("alertMessage", "Success Update Category");
            req.flash("alertStatus", "success");

            res.redirect("/admin/categories");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/categories");
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);

            req.flash("alertMessage", "Success Delete Category");
            req.flash("alertStatus", "success");

            res.redirect("/admin/categories");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/categories");
        }
    },
};
