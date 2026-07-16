const express = require("express");
const router = express.Router();
const { uploadMultiple, upload } = require("../../src/middlewares/multer");

const dashboardController = require("../../src/controllers/admin/dashboard.controller");
const categoryController = require("../../src/controllers/admin/category.controller");
const bankController = require("../../src/controllers/admin/bank.controller");
const propertyController = require("../../src/controllers/admin/property.controller");
const bookingController = require("../../src/controllers/admin/booking.controller");

router.get("/dashboard", dashboardController.dashboard);

router.get("/categories", categoryController.category);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

router.get("/banks", bankController.bank);
router.post("/banks", upload, bankController.createBank);
router.put("/banks/:id", upload, bankController.updateBank);
router.delete("/banks/:id", bankController.deleteBank);

router.get("/properties", propertyController.property);
router.post("/properties", uploadMultiple, propertyController.createProperty);
router.get("/properties/images/:id", propertyController.showImage);
router.get("/properties/:id", propertyController.editProperty);
router.put(
    "/properties/:id",
    uploadMultiple,
    propertyController.updateProperty,
);
router.delete("/properties/:id", propertyController.deleteProperty);

router.get("/bookings", bookingController.booking);

module.exports = router;
