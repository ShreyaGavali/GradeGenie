const Course = require("../models/course.js")

const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body)
    await newCourse.save()
    res.status(201).json({ message: "Course created successfully", course: newCourse })
  } catch (error) {
    console.error("Error creating course:", error)
    res.status(500).json({ error: "Failed to create course" })
  }
}

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })
    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" })
  }
}

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params
    const course = await Course.findById(id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.status(200).json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ error: "Failed to fetch course" })
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
}
