const express = require("express");
const router = express.Router();
const { uploadImage } = require("../../src/middlewares/multer");

const summaryController = require("../../src/controllers/frontend/summary.controller");
const categoryController = require("../../src/controllers/frontend/category.controller");
const propertyController = require("../../src/controllers/frontend/property.controller");
const bankController = require("../../src/controllers/frontend/bank.controller");
const bookingController = require("../../src/controllers/frontend/booking.controller");

router.get("/summary", summaryController.summary);

router.get("/categories", categoryController.category);

router.get("/properties", propertyController.property);
router.get("/property/:id", propertyController.showProperty);

router.get("/banks", bankController.bank);

router.post("/booking", uploadImage, bookingController.booking);

module.exports = router;
