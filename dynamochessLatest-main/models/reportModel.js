const mongoose = require('mongoose');

// Define the schema for a report
const reportSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // References the User model
      required: true,
      ref: 'User', // Ensures it's associated with the User model
    },
    reasons: {
      type: String, // Store the result as a string
      required: true, // Mark as required
      default: '', // Default to an empty string if no result is provided
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date and time
    },
  },
  {
    versionKey: false, // Disable the version key (_v) in documents
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Report', reportSchema);
