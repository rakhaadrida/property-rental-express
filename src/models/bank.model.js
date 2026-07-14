const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Bank", bankSchema);
