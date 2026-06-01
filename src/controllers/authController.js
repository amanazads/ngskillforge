const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const transporter = require("../config/mail");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }


        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCurrentUser = async (req, res) => {

    try {

        res.status(200).json({
            success: true,
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const refreshAccessToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = generateAccessToken(decoded.userId);

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });

    }
};

const logoutUser = async (req, res) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.refreshToken = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const sendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        let user = await User.findOne({ email });

        if (!user) {

            user = await User.create({
                name: "Temp User",
                email,
                password: "123456"
            });

        }

        user.otp = otp;

        user.otpExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Your OTP",

            text: `Your OTP is ${otp}`

        });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        user.isVerified = true;

        user.otp = null;

        user.otpExpires = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
    sendOTP,
    verifyOTP
};