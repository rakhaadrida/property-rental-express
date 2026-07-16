const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertyFeatureSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },

    feature: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    quantity: {
        type: Number,
    },
});

propertyFeatureSchema.index({ property: 1, feature: 1 }, { unique: true });

module.exports = mongoose.model("PropertyFeature", propertyFeatureSchema);
