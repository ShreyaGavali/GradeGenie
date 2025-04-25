const express = require("express");
const router = express.Router();
const {
  saveAssignment,
  getAllAssignments,
  getAssignmentById,
} = require("../controllers/assignmentController");

// Route to save a new assignment
router.post("/save-assignment", saveAssignment);

// Route to get all assignments
router.get("/", getAllAssignments);

// Route to get a specific assignment by ID
router.get("/:id", getAssignmentById);

module.exports = router;
