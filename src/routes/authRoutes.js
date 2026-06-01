const express = require("express");
const router = express.Router();
const { refreshAccessToken } = require("../controllers/authController");
const {logoutUser} = require("../controllers/authController");
const {getCurrentUser} = require("../controllers/authController");
const {sendOTP} = require("../controllers/authController");
const {verifyOTP} = require("../controllers/authController");

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;