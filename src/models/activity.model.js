const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    imageUrl: {
        tye: String,
        required: true,
    },
    isPopular: {
        type: Boolean,
    },
});

module.exports = mongoose.model("Activity", activitySchema);
