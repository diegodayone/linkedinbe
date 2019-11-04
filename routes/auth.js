const express = require("express")
const passport = require("passport")
const User = require("../models/user")
const passportConfig = require("../passportConfig")

var router = express.Router()

router.post("/signUp", async (req, res)=>{
    try{
        req.body.username = req.body.email;
        var user = await User.register(req.body, req.body.password)
        const token = passportConfig.createNewToken({ _id: user._id, email: req.body.email})
        res.json({
            message: "User Created",
            token: token,
            user: user
        })
    }
    catch(ex){
        res.statusCode = 500;
        res.send(ex)
    }
})

router.post("/login", passport.authenticate("local"), (req, res)=>{
    const token = passportConfig.createNewToken({ _id: req.user._id, email: req.email})
    res.json({
        message: "Logged in success",
        token: token,
        user: req.user
    })
})

router.post("/refresh", passport.authenticate("jwt"), async (req, res)=>{
    const token = passportConfig.createNewToken({ _id: req.user._id, email: req.email})
    res.json({
        message: "Token renewed",
        token: token,
        user: req.user
    })
})

module.exports = router;
