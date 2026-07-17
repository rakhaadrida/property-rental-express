const Customer = require("../../models/customer.model");
const Booking = require("../../models/booking.model");
const Property = require("../../models/property.model");

module.exports = {
    dashboard: async (req, res) => {
        try {
            const customer = await Customer.find();
            const booking = await Booking.find();
            const property = await Property.find();

            const earnings = await Booking.aggregate([
                {
                    $group: {
                        _id: null,
                        totalEarning: { $sum: "$total" },
                    },
                },
            ]);

            const totalEarnings = earnings[0]?.totalEarning || 0;

            res.render("admin/dashboard/dashboard", {
                title: "Isakha Rentals | Dashboard",
                customer,
                booking,
                property,
                totalEarnings,
            });
        } catch (error) {
            res.redirect("/admin/banks");
        }
    },
};
