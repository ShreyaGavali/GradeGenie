const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    rawText: {type: String},
  },
  { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)
