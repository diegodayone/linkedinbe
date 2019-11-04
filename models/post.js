const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    text: {
        type: String,
        required: true
    },
    image: String
},{
    timestamps: true
})

module.exports = mongoose.model("posts", postSchema)