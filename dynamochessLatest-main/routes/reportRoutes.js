const express = require('express');
const { createReport, getUserReports } = require('../controllers/report/reportController'); // Adjust path as necessary

const router = express.Router();

// Route to create a new report
router.post('/reports/:userId', createReport);

// Route to get all reports for a specific user
router.get('/report/:userId', getUserReports);

module.exports = router;
