const GeneratedAssignment = require("../models/generatedAssignment");

// Controller for saving an assignment
const saveAssignment = async (req, res) => {
  try {
    const newEntry = new GeneratedAssignment(req.body);
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving data", error: err });
  }
};

// Controller for fetching all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await GeneratedAssignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// Controller for fetching a specific assignment by ID
const getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await GeneratedAssignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveAssignment,
  getAllAssignments,
  getAssignmentById,
};
