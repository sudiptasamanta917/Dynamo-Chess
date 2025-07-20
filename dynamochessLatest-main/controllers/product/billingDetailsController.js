const BillingDetails = require("../../models/billingDetailsModel");
const User = require("../../models/userModel");
const mongoose = require("mongoose");

// Create new billing details
const createBillingDetails = async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` is set by authentication middleware

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user data
    const userData = await User.findById(user._id);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Destructure and validate the incoming request body
    const { address, apartment, city, state, postcode, addressType, name, email, phone } = req.body;

    if (!address || !city || !state || !postcode || !addressType || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in the request body",
      });
    }

    // Create a new billing details instance with validations
    const billingDetails = new BillingDetails({
      userId: user._id,
      name,
      email,
      phone,
      address,
      apartment,
      city,
      state,
      postcode,
      addressType,
    });

    // Attempt to save billing details to the database
    const savedDetails = await billingDetails.save();

    res.status(201).json({
      success: true,
      message: "Billing details created successfully",
      userData,
      billingDetails: savedDetails,
    });
  } catch (error) {
    console.error("Error while creating billing details: ", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred while saving billing details",
    });
  }
};

// Get all billing details
const getAllBillingDetails = async (req, res) => {
  try {
    const billingDetails = await BillingDetails.find();
    res.status(200).json({
      success: true,
      message: "Billing details fetched successfully",
      data: billingDetails,
    });
  } catch (error) {
    console.error("Error while fetching all billing details: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get billing details by ID
const getBillingDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const billingDetail = await BillingDetails.findById(id);

    if (!billingDetail) {
      return res.status(404).json({ success: false, message: "Billing details not found" });
    }

    res.status(200).json({
      success: true,
      message: "Billing details fetched successfully",
      data: billingDetail,
    });
  } catch (error) {
    console.error("Error while fetching billing details by ID: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get billing details by User ID
const getBillingDetailsByUserId = async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` is set by auth middleware

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user data
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Extract `page` and `limit` from query parameters
    const { page = 1, limit = 3 } = req.query;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch billing details related to the user with pagination
    const billingDetails = await BillingDetails.find({ userId: user._id })
      .skip(skip)
      .limit(parseInt(limit));

    // Count total billing details for the user
    const totalItems = await BillingDetails.countDocuments({ userId: user._id });

    if (!billingDetails.length) {
      return res.status(404).json({ success: false, message: "No billing details found for this user" });
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Billing details fetched successfully",
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalItems: totalItems,
      userData,
      billingDetails,
    });
  } catch (error) {
    console.error("Error while fetching billing details by userId: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update billing details by ID
const updateBillingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const updatedDetails = await BillingDetails.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedDetails) {
      return res.status(404).json({ success: false, message: "Billing details not found" });
    }

    res.status(200).json({
      success: true,
      message: "Billing details updated",
      data: updatedDetails,
    });
  } catch (error) {
    console.error("Error while updating billing details: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete billing details by ID
const deleteBillingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const deletedDetails = await BillingDetails.findByIdAndDelete(id);

    if (!deletedDetails) {
      return res.status(404).json({ success: false, message: "Billing details not found" });
    }

    res.status(200).json({
      success: true,
      message: "Billing details deleted",
      data: deletedDetails,
    });
  } catch (error) {
    console.error("Error while deleting billing details: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createBillingDetails,
  getAllBillingDetails,
  getBillingDetailsById,
  updateBillingDetails,
  deleteBillingDetails,
  getBillingDetailsByUserId,
};
