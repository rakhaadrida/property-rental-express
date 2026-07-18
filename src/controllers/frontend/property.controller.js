const Property = require("../../models/property.model");
const PropertyFeature = require("../../models/property-feature.model");

module.exports = {
    property: async (req, res) => {
        try {
            const properties = await Property.find()
                .select("_id name city country price")
                .populate({
                    path: "propertyImageIds",
                    perDocumentLimit: 1,
                });

            res.status(200).json({ data: properties });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    showProperty: async (req, res) => {
        try {
            const property = await Property.findById(req.params.id)
                .populate("propertyImageIds")
                .populate("activityIds");

            if (!property) {
                res.status(500).json({ message: "Property Not Found" });
            }

            const features = await PropertyFeature.find({
                property: property._id,
            }).populate("feature");

            const data = {
                ...property.toObject(),
                features: features.map((item) => ({
                    id: item.feature._id,
                    name: item.feature.name,
                    icon: item.feature.icon,
                    quantity: item.quantity,
                })),
            };

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
