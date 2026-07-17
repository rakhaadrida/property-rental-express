const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Constant = require("../constants/constant");

const activitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(Constant.ACTIVITY_TYPE).map((item) => item.value),
        default: Constant.ACTIVITY_TYPE.NATURE,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isPopular: {
        type: Boolean,
    },
});

module.exports = mongoose.model("Activity", activitySchema);
