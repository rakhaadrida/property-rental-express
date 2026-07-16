const Feature = require("../../models/feature.model");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    feature: async (req, res) => {
        try {
            const feature = await Feature.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/feature/feature", {
                title: "Isakha Rentals | Feature",
                feature,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/features");
        }
    },

    createFeature: async (req, res) => {
        try {
            const { name } = req.body;
            await Feature.create({
                name,
                icon: `images/${req.file.filename}`,
            });

            req.flash("alertMessage", "Success Add Feature");
            req.flash("alertStatus", "success");

            res.redirect("/admin/features");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/features");
        }
    },

    updateFeature: async (req, res) => {
        try {
            const { name } = req.body;
            const feature = await Feature.findById(req.params.id);
            const oldIcon = feature.icon;

            if (!feature) {
                req.flash("alertMessage", "Feature not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/features");
            }

            if (req.file) {
                feature.icon = `images/${req.file.filename}`;
            }

            feature.name = name;

            await feature.save();

            if (req.file && oldIcon) {
                try {
                    const oldIconPath = path.join("public", oldIcon);
                    await fs.unlink(oldIconPath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            req.flash("alertMessage", "Success Update Feature");
            req.flash("alertStatus", "success");

            res.redirect("/admin/features");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/features");
        }
    },

    deleteFeature: async (req, res) => {
        try {
            const feature = await Feature.findById(req.params.id);

            if (!feature) {
                req.flash("alertMessage", "Feature not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/features");
            }

            if (feature.icon) {
                try {
                    const iconPath = path.join("public", feature.icon);
                    await fs.unlink(iconPath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            await feature.deleteOne();

            req.flash("alertMessage", "Success Delete Feature");
            req.flash("alertStatus", "success");

            res.redirect("/admin/features");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/features");
        }
    },
};
