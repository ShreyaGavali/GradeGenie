const express = require("express")
const router = express.Router()
const { createCourse, getCourses, getCourseById } = require("../controllers/courseController")

router.post("/save-course", createCourse)
router.get("/all", getCourses)
router.get("/:id", getCourseById)

module.exports = router
