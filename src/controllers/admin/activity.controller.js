const Activity = require("../../models/activity.model");
const Constant = require("../../constants/constant");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    activity: async (req, res) => {
        try {
            const activity = await Activity.find();
            const activityType = Object.values(Constant.ACTIVITY_TYPE);

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/activity/activity", {
                title: "Isakha Rentals | Activity",
                activity,
                activityType,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/activities");
        }
    },

    createActivity: async (req, res) => {
        try {
            const { name, type } = req.body;
            await Activity.create({
                name,
                type,
                imageUrl: `images/${req.file.filename}`,
            });

            req.flash("alertMessage", "Success Add Activity");
            req.flash("alertStatus", "success");

            res.redirect("/admin/activities");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/activities");
        }
    },

    updateActivity: async (req, res) => {
        try {
            const { name, type } = req.body;
            const activity = await Activity.findById(req.params.id);
            const oldImage = activity.image;

            if (!activity) {
                req.flash("alertMessage", "Activity not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/activities");
            }

            if (req.file) {
                activity.image = `images/${req.file.filename}`;
            }

            activity.name = name;
            activity.type = type;

            await activity.save();

            if (req.file && oldImage) {
                try {
                    const oldImagePath = path.join("public", oldImage);
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            req.flash("alertMessage", "Success Update Activity");
            req.flash("alertStatus", "success");

            res.redirect("/admin/activities");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/activities");
        }
    },

    deleteActivity: async (req, res) => {
        try {
            const activity = await Activity.findById(req.params.id);

            if (!activity) {
                req.flash("alertMessage", "Activity not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/activities");
            }

            if (activity.image) {
                try {
                    const imagePath = path.join("public", activity.image);
                    await fs.unlink(imagePath);
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            await activity.deleteOne();

            req.flash("alertMessage", "Success Delete Activity");
            req.flash("alertStatus", "success");

            res.redirect("/admin/activities");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/activities");
        }
    },
};
