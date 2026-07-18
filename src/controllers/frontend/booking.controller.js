const Booking = require("../../models/booking.model");
const Customer = require("../../models/customer.model");
const Property = require("../../models/property.model");

module.exports = {
    booking: async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                propertyId,
                duration,
                firstName,
                lastName,
                email,
                phoneNumber,
                sourceBank,
                sourceBankHolder,
            } = req.body;

            if (!req.file) {
                return res.status(422).json({ message: "Image is required" });
            }

            const property = await Property.findById(propertyId);

            if (!property) {
                res.status(500).json({ message: "Property Not Found" });
            }

            const customer = await Customer.create({
                firstName,
                lastName,
                email,
                phoneNumber,
            });

            const invoiceNumber = Math.floor(1000000 + Math.random() * 9000000);

            const total = property.price * duration;
            const tax = (total * 10) / 100;
            const subtotal = total + tax;

            const booking = await Booking.create({
                invoice: invoiceNumber,
                startDate,
                endDate,
                propertyId: {
                    _id: property._id,
                    name: property.name,
                    price: property.price,
                    duration,
                },
                total: subtotal,
                customerId: customer._id,
                payment: {
                    proofOfPayment: `images/${req.file.filename}`,
                    sourceBank,
                    sourceBankHolder,
                },
            });

            res.status(200).json({
                message: "Booking Successfull",
                data: booking,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
