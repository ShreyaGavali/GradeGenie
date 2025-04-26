// routes/uploadRoutes.js

const express = require('express');
const { uploadAssignment, getSubmissions } = require('../controllers/uploadController');

const router = express.Router();

// POST route for uploading assignment
router.post('/upload-assignment', uploadAssignment);
router.get("/submissions/:assignmentId", getSubmissions);

module.exports = router;
