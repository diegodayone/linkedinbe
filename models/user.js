const mongoose = require("mongoose")
const passportLocal = require("passport-local-mongoose")
const Experience = require("./experience")

var user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    area: String,
    bio: String,
    email: String,
    title: String,
    image: String,
    experiences: [Experience]
    },{
        timestamps:true
    }
)

user.plugin(passportLocal) //password hash, username, authenticate()...

module.exports = mongoose.model("User", user)