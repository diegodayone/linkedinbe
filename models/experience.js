const mongoose = require("mongoose")

const experienceSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
        }
});

module.exports = experienceSchema