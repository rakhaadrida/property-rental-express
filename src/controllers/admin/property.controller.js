const Category = require("../../models/category.model");
const Feature = require("../../models/feature.model");
const Property = require("../../models/property.model");
const PropertyImage = require("../../models/property-image.model");
const PropertyFeature = require("../../models/property-feature.model");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    property: async (req, res) => {
        try {
            const property = await Property.find()
                .populate("categoryId", "name")
                .populate("propertyImageIds", "url");

            const categories = await Category.find();
            const features = await Feature.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/property/property", {
                title: "Isakha Rentals | Property",
                property,
                categories,
                features,
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
            const { name, price, city, categoryId, description, features } =
                req.body;

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

            const propertyFeatures = features
                .filter((item) => item.quantity?.trim())
                .map((item) => ({
                    property: property._id,
                    feature: item.id,
                    quantity: item.quantity,
                }));

            if (propertyFeatures.length) {
                await PropertyFeature.insertMany(propertyFeatures);
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

    editProperty: async (req, res) => {
        try {
            const property = await Property.findById(req.params.id).populate(
                "categoryId",
                "name",
            );
            const categories = await Category.find();
            const features = await Feature.find().lean();

            const propertyFeatures = await PropertyFeature.find({
                property: req.params.id,
            }).lean();

            const featureMap = new Map(
                propertyFeatures.map((item) => [
                    item.feature.toString(),
                    item.quantity,
                ]),
            );

            const featureList = features.map((feature) => ({
                ...feature,
                quantity: featureMap.get(feature._id.toString()) ?? "",
            }));

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/property/edit", {
                title: "Isakha Rentals | Edit Property",
                property,
                categories,
                features: featureList,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },

    updateProperty: async (req, res) => {
        try {
            const { name, price, city, categoryId, description } = req.body;
            const property = await Property.findById(req.params.id)
                .populate("categoryId", "name")
                .populate("propertyImageIds", "url");

            if (!property) {
                req.flash("alertMessage", "Property not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/properties");
            }

            const oldCategoryId = property.categoryId._id;
            const oldPropertyImages = property.propertyImageIds.slice();

            if (req.files.length > 0) {
                const newPropertyImages = [];

                await Promise.all(
                    req.files.map(async (file) => {
                        const image = await PropertyImage.create({
                            url: `images/${file.filename}`,
                        });

                        newPropertyImages.push(image._id);
                    }),
                );

                property.propertyImageIds = newPropertyImages;
                await property.save();
            }

            property.name = name;
            property.price = price;
            property.city = city;
            property.categoryId = categoryId;
            property.description = description;

            await property.save();

            if (req.files.length > 0 && oldPropertyImages.length > 0) {
                try {
                    await Promise.all(
                        oldPropertyImages.map(async (image) => {
                            const imagePath = path.join("public", image.url);

                            await fs.unlink(imagePath);
                        }),
                    );
                } catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error(err);
                    }
                }
            }

            if (oldCategoryId !== categoryId) {
                await Category.findByIdAndUpdate(oldCategoryId, {
                    $pull: {
                        propertyIds: property._id,
                    },
                });

                await Category.findByIdAndUpdate(categoryId, {
                    $addToSet: {
                        propertyIds: property._id,
                    },
                });
            }

            req.flash("alertMessage", "Success Update Property");
            req.flash("alertStatus", "success");

            res.redirect("/admin/properties");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },

    deleteProperty: async (req, res) => {
        try {
            const property = await Property.findById(req.params.id)
                .populate("categoryId", "name")
                .populate("propertyImageIds", "url");

            if (!property) {
                req.flash("alertMessage", "Property not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/properties");
            }

            await Category.findByIdAndUpdate(property.categoryId._id, {
                $pull: {
                    propertyIds: property._id,
                },
            });

            if (property.propertyImageIds.length > 0) {
                await Promise.all(
                    property.propertyImageIds.map(async (image) => {
                        try {
                            await fs.unlink(path.join("public", image.url));
                        } catch (err) {
                            if (err.code !== "ENOENT") {
                                throw err;
                            }
                        }
                    }),
                );

                await PropertyImage.deleteMany({
                    _id: {
                        $in: property.propertyImageIds.map((img) => img._id),
                    },
                });
            }

            await property.deleteOne();

            req.flash("alertMessage", "Success Delete Property");
            req.flash("alertStatus", "success");

            res.redirect("/admin/properties");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/properties");
        }
    },

    showProperty: async (req, res) => {
        try {
            const property = await Property.findById(req.params.id).populate(
                "categoryId",
                "name",
            );

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/property/edit", {
                title: "Isakha Rentals | Detail Property",
                property,
                alert,
            });
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
