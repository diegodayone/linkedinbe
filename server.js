const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")

const config = require("./config")
const auth = require("./routes/auth")
const profile = require("./routes/profile")
const posts = require("./routes/post")
const cors = require("cors")

const passportConfiguration = require("./passportConfig")
const dotenv = require('dotenv');
dotenv.config();

const connection = mongoose.connect(process.env.DB, { useNewUrlParser: true})
connection.then(db => {
    console.log("DB connected")
},
err => {
    console.log(err)
})

/*
Today we're gonna build both FE and BE for LinkedIn App
- FE won't have all the styles
- Backend won't have the SocketIO part
*/

const server = express()
server.set("port", process.env.PORT || 3123) //for cloud port decision
server.use(express.json())
server.use(cors())
server.use(passport.initialize())


server.use("/auth", auth)

server.use("/profiles", passport.authenticate("jwt"), profile)
server.use("/posts", passport.authenticate("jwt"), posts)

server.listen(server.get("port"), () => {
    console.log("Server is running on " + server.get("port"))
})



