const Booking = require("../../models/booking.model");
const Customer = require("../../models/customer.model");

module.exports = {
    booking: async (req, res) => {
        try {
            const booking = await Booking.find()
                .populate("propertyId")
                .populate("customerId")
                .populate("bankId");

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/booking/booking", {
                title: "Isakha Rentals | Booking",
                booking,
                alert,
            });
        } catch (error) {
            console.log(error.message);
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/bookings");
        }
    },

    showBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id)
                .populate("propertyId")
                .populate("customerId")
                .populate("bankId");

            if (!booking) {
                req.flash("alertMessage", "Booking not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/bookings");
            }

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };

            res.render("admin/booking/detail", {
                title: "Isakha Rentals | Detail Booking",
                booking,
                alert,
            });
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/bookings");
        }
    },

    approveBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                req.flash("alertMessage", "Booking not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/bookings");
            }

            booking.payment.status = "Approved";

            await booking.save();

            req.flash("alertMessage", "Success Approve Booking");
            req.flash("alertStatus", "success");

            res.redirect(`/admin/bookings/${booking._id}`);
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/bookings/${booking._id}");
        }
    },

    rejectBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                req.flash("alertMessage", "Booking not found");
                req.flash("alertStatus", "danger");

                return res.redirect("/admin/bookings");
            }

            booking.payment.status = "Rejected";

            await booking.save();

            req.flash("alertMessage", "Success Reject Booking");
            req.flash("alertStatus", "success");

            res.redirect(`/admin/bookings/${booking._id}`);
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/admin/bookings/${booking._id}");
        }
    },
};
