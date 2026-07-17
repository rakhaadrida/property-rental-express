const express = require("express");
const router = express.Router();
const { authenticate, isGuest } = require("../../src/middlewares/auth");
const {
    uploadMultiple,
    upload,
    uploadIcon,
    uploadImage,
} = require("../../src/middlewares/multer");

const authController = require("../../src/controllers/admin/auth.controller");
const dashboardController = require("../../src/controllers/admin/dashboard.controller");
const bankController = require("../../src/controllers/admin/bank.controller");
const categoryController = require("../../src/controllers/admin/category.controller");
const featureController = require("../../src/controllers/admin/feature.controller");
const activityController = require("../../src/controllers/admin/activity.controller");
const propertyController = require("../../src/controllers/admin/property.controller");
const bookingController = require("../../src/controllers/admin/booking.controller");

router.get("/login", isGuest, authController.showLogin);
router.post("/login", isGuest, authController.login);

router.use(authenticate);
router.get("/logout", authController.logout);

router.get("/dashboard", dashboardController.dashboard);

router.get("/banks", bankController.bank);
router.post("/banks", upload, bankController.createBank);
router.put("/banks/:id", upload, bankController.updateBank);
router.delete("/banks/:id", bankController.deleteBank);

router.get("/categories", categoryController.category);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

router.get("/features", featureController.feature);
router.post("/features", uploadIcon, featureController.createFeature);
router.put("/features/:id", uploadIcon, featureController.updateFeature);
router.delete("/features/:id", featureController.deleteFeature);

router.get("/activities", activityController.activity);
router.post("/activities", uploadImage, activityController.createActivity);
router.put("/activities/:id", uploadImage, activityController.updateActivity);
router.delete("/activities/:id", activityController.deleteActivity);

router.get("/properties", propertyController.property);
router.post("/properties", uploadMultiple, propertyController.createProperty);
router.get("/properties/:id", propertyController.editProperty);
router.put(
    "/properties/:id",
    uploadMultiple,
    propertyController.updateProperty,
);
router.delete("/properties/:id", propertyController.deleteProperty);
router.get("/properties/images/:id", propertyController.showImage);

router.get("/bookings", bookingController.booking);
router.get("/bookings/:id", bookingController.showBooking);
router.post("/bookings/:id/approve", bookingController.approveBooking);
router.post("/bookings/:id/reject", bookingController.rejectBooking);

module.exports = router;
