const Course = require("../models/Course");

const createCourse = async (req, res) => {

    try {

        const { title, description, price } = req.body;

        const course = await Course.create({
            title,
            description,
            price,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCourses = async (req, res) => {

    try {

        const page = parseInt(req.query.page) ||1;

        const limit = parseInt(req.query.limit) || 5;

        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        const searchFilter = {
            title: { $regex: search, $options: "i" }
        };

        const courses = await Course.find(searchFilter)
            .skip(skip)
            .limit(limit);

        const totalCourses = await Course.countDocuments(searchFilter);

        res.status(200).json({
            success: true,
            totalCourses,
            currentPage: page,
            totalPages: Math.ceil(totalCourses / limit),
            courses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCourseById = async (req, res) => {

    try {

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateCourse = async (req, res) => {

    try {

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const deleteCourse = async (req, res) => {

    try {

        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};