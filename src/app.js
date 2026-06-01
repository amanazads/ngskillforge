const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const courseRoutes = require("./routes/courseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use("/api/upload", uploadRoutes);
app.use(morgan('dev'));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the backend API",
    });
});

module.exports = app;