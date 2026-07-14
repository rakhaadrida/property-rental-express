const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    imageUrl: {
        tye: String,
        required: true,
    },
});

module.exports = mongoose.model("Feature", featureSchema);
