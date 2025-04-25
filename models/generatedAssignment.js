const mongoose = require("mongoose");

const GeneratedAssignmentSchema = new mongoose.Schema({
  assignmentTitle: String,
  selectedType: String,
  selectedCourse: String,
  dueDate: String,
  description: String,
  learningObjectives: String,
  generatedContent: Object, // or use Schema.Types.Mixed for more flexibility
}, { timestamps: true });

module.exports = mongoose.model("GeneratedAssignment", GeneratedAssignmentSchema);
