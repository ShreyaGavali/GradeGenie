// controllers/uploadController.js

const mongoose = require('mongoose');
const Upload = require('../models/upload');

const uploadAssignment = async (req, res) => {
  const { cloudinaryUrl, userId, assignmentId } = req.body;

  if (!cloudinaryUrl || !userId || !assignmentId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUpload = new Upload({
      cloudinaryUrl,
      userId,
      assignmentId,
    });

    await newUpload.save();

    res.status(201).json({ message: 'Upload saved successfully!', upload: newUpload });
  } catch (error) {
    console.error('Error saving upload:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getSubmissions = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const submissions = await Upload.find({ assignmentId })
      .populate('userId'); // 🧠 This will fetch full student data based on studentId

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  uploadAssignment,
  getSubmissions
};
