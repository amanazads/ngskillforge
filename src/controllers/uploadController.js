const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

const uploadFile = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const result = await cloudinary.uploader.upload(
            req.file.path
        );

        // Save in MongoDB
        const file = await File.create({
            imageUrl: result.secure_url
        });

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getFiles = async (req, res) => {

    try {

        const files = await File.find();

        res.status(200).json({
            success: true,
            files
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    uploadFile,
    getFiles
};