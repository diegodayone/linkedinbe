const express = require("express")
const User = require("../models/user")
const config = require("../config")
const MulterAzureStorage = require("multer-azure-storage")
const multer = require("multer")
const dotenv = require('dotenv');
dotenv.config();

var router = express();

router.get("/", async(req, res)=>{
    res.send (await User.find(req.query))
})

router.put("/", async(req, res)=>{
    delete req.body.username
    delete req.body.salt
    delete req.body.hash

    res.send(await User.findByIdAndUpdate(req.user._id, req.body))
})

router.get("/:id", async(req, res)=>{
    res.send (await User.findById(req.params.id))
})

var profileConfig = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.STORAGE,
        containerName: "profile",
        containerSecurity: "blob"
    })
})

router.post("/picture", profileConfig.single("image"), async(req, res)=>{
    await User.findByIdAndUpdate(req.user._id, {
        image: req.file.url
    })

    res.send(req.file.url)
})

router.get("/:id/experiences", async(req, res)=>{
    res.send((await User.findById(req.params.id)).experiences)
})

router.post("/:id/experiences", async(req, res)=>{
    var user = await User.findById(req.params.id);
    if (!user) {
        res.statusCode = 404;
        res.send("Not found")
        return;
    }
    if (user._id.toString() != req.user._id.toString()){
        res.statusCode = 401;
        res.send("You can only add your own experiences")
        return;
    }

    var result = await User.findByIdAndUpdate(req.params.id, {
        $push: { experiences: req.body }
    },
    { "new": true })

    console.log(result)

    res.json(result.experiences[result.experiences.length-1])
})

var experienceConfig = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.STORAGE,
        containerName: "experiences",
        containerSecurity: "blob"
    })
})

router.post("/:id/experiences/:expId/picture", experienceConfig.single("image"), async(req, res)=>{
    var user = await User.findById(req.params.id);
    if (!user) {
        res.statusCode = 404;
        res.send("Not found")
        return;
    }
    if (user._id.toString() != req.user._id.toString()){
        res.statusCode = 401;
        res.send("You can only edit your own experiences")
        return;
    }

    var x = await User.updateOne({ "experiences._id": req.params.expId}, { 
        $set: { "experiences.$.image": req.file.url } 
    })

    res.send(req.file.url)
})

router.put("/:id/experiences/:expId", async(req, res)=>{
    var user = await User.findById(req.params.id);
    if (!user) {
        res.statusCode = 404;
        res.send("Not found")
        return;
    }
    if (user._id.toString() != req.user._id.toString()){
        res.statusCode = 401;
        res.send("You can only edit your own experiences")
        return;
    }

    var result = await User.update({ "experiences._id": req.params.expId}, { //Select the experience with id = req.params.expId
        $set: { "experiences.$": req.body } //Set the selected experience ($) to req.body
    }, { "new": true})
    
    res.send(result)
})

router.delete("/:id/experiences/:expId", async(req, res)=>{
    var user = await User.findById(req.params.id);
    if (!user) {
        res.statusCode = 404;
        res.send("Not found")
        return;
    }
    if (user._id.toString() != req.user._id.toString()){
        res.statusCode = 401;
        res.send("You can only delete your own experiences")
        return;
    }

    var result = await User.findByIdAndUpdate(req.params.id, { //find the profile with ID = req.params.id
        $pull: { //remove from the experience array
            experiences: {_id: req.params.expId} //the experience with id = req.params.expId
        }
    })

    res.json(result)
})



module.exports = router;