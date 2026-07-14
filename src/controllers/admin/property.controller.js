const Category = require("../../models/category.model");
const Property = require("../../models/property.model");
const PropertyImage = require("../../models/property-image.model");

module.exports = {
    property: async (req, res) => {
        try {
            const property = await Property.find()
                .populate("categoryId", "name")
                .populate("propertyImageIds", "url");

            const category = await Category.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/property/property", {
                title: "Isakha Rentals | Property",
                property,
                category,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },

    createProperty: async (req, res) => {
        try {
            const { name, price, city, categoryId, description } = req.body;

            const property = await Property.create({
                name,
                price,
                city,
                categoryId,
                description,
            });

            if (req.files.length > 0) {
                await Promise.all(
                    req.files.map(async (file) => {
                        const image = await PropertyImage.create({
                            url: `images/${file.filename}`,
                        });

                        property.propertyImageIds.push(image._id);
                    }),
                );

                await property.save();
            }

            const category = await Category.findOne({ _id: categoryId });

            if (category) {
                category.propertyIds.push(property._id);

                await category.save();
            }

            req.flash("alertMessage", "Success Add Property");
            req.flash("alertStatus", "success");

            res.redirect("/admin/properties");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },

    showImage: async (req, res) => {
        try {
            const property = await Property.findById(req.params.id).populate(
                "propertyImageIds",
                "url",
            );

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/property/show-image", {
                title: "Isakha Rentals | Property Images",
                property,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },
};
