const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    propertyId: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    invoice: {
        type: Number,
    },
    total: {
        type: Number,
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    bankId: {
        type: Schema.Types.ObjectId,
        ref: "Bank",
    },
    payment: {
        proofOfPayment: {
            type: String,
            required: true,
        },
        sourceBank: {
            type: String,
            required: true,
        },
        sourceBankHolder: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
