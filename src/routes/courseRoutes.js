const express = require("express");

const router = express.Router();

const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");

const protect = require("../middlewares/authMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", protect, createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", protect, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

module.exports = router;