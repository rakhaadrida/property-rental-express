const Activity = require("../../models/activity.model");
const Booking = require("../../models/booking.model");
const Property = require("../../models/property.model");

module.exports = {
    summary: async (req, res) => {
        try {
            const activities = await Activity.find();
            const bookings = await Booking.find();
            const properties = await Property.find();

            const data = {
                totalTreasure: activities.length,
                totalTraveler: bookings.length,
                totalProperty: properties.length,
            };

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
