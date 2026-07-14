const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        default: "Indonesia",
    },
    city: {
        type: String,
        required: true,
    },
    isPopular: {
        type: Boolean,
    },
    propertyImageIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "PropertyImage",
        },
    ],
    featureIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Feature",
        },
    ],
    activityIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Activity",
        },
    ],
});

module.exports = mongoose.model("Property", propertySchema);
