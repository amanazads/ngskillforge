const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({

    imageUrl: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);