const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertyImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PropertyImage", propertyImageSchema);
