const mongoose = require("mongoose");

// Define the schema for billing details
const billingDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        required: true,
        default: "Home",
    },
    country: {
        type: String,
        required: true,
        default: "India",
    },
    address: {
        type: String,
        required: true,
    },
    apartment: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postcode: {
        type: String,
        required: true,
    },
}, { versionKey: false });

// Export the BillingDetails model
module.exports = mongoose.model("BillingDetails", billingDetailsSchema);
