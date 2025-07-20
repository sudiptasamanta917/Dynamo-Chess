const Report = require('../../models/reportModel'); // Adjust the path if necessary
const mongoose = require('mongoose'); // For ObjectId validation

// Controller function to create a new report
const createReport = async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters
  const { reasons } = req.body;

  // Validate if userId and reasons are provided
  if (!userId || !reasons) {
    return res.status(400).json({ success: false, message: "User ID and reasons are required" });
  }

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  try {
    // Create a new report document
    const newReport = new Report({
      userId,
      reasons,
    });

    // Save the report to the database
    const savedReport = await newReport.save();

    // Send the success response
    return res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: savedReport,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message,
    });
  }
};

// Controller function to fetch all reports for a specific user
const getUserReports = async (req, res) => {
  const { userId } = req.params;

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  try {
    // Find all reports for the given userId
    const reports = await Report.find({ userId });

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this user',
      });
    }

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getUserReports,
};
