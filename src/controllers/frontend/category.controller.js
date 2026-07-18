const Category = require("../../models/category.model");

module.exports = {
    category: async (req, res) => {
        try {
            const categories = await Category.find()
                .populate({
                    path: "propertyIds",
                    select: "_id name city country price isPopular",
                    perDocumentLimit: 4,
                    populate: {
                        path: "propertyImageIds",
                        perDocumentLimit: 1,
                    },
                })
                .limit(3);

            res.status(200).json({ data: categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
