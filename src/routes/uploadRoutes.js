const express = require("express");

const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
    uploadFile,
    getFiles
} = require("../controllers/uploadController");

router.post(
    "/",
    upload.single("image"),
    uploadFile,
);

router.get(
    "/",
    getFiles
);

module.exports = router;