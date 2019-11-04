const express = require("express")
const Posts = require("../models/post")
const MulterAzureStorage = require("multer-azure-storage")
const multer = require("multer")
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

//1) get posts
router.get("/", async (req, res)=>{
    //pagination, filtering etc
    let filter = req.query;
    const { skip, limit } = filter

    res.send(await Posts.find({}).limit(parseInt(limit)).skip(parseInt(skip)))
})

//2) get posts from user
router.get("/:userId", async (req, res)=>{
    res.send(await Posts.find({ userId: req.params.userId}))
})

//3) Create, delete posts
router.post("/", async (req, res)=>{
    req.body.userId = req.user.username;
    var post = new Posts(req.body)
    await post.save();

    res.send(post)
})

router.delete("/:postId", async (req, res)=>{
    const post = await Posts.findById(req.params.postId)
    if (post.userId == req.user.username){
        await Posts.findByIdAndDelete(req.params.postId)
        res.send("Deleted")
    }
    else{
        res.status = 401;
        res.send("You cannot delete other ppl posts")
    }
})

//4) Upload picture
var postConfig = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.STORAGE,
        containerName: "posts",
        containerSecurity: "blob"
    })
})

router.post("/:postId/picture", postConfig.single("image"), async (req, res)=>{
    const post = await Posts.findById(req.params.postId)
    if (post.userId == req.user.username){
        await Posts.findByIdAndUpdate(req.params.postId, {
            image: req.file.url
        })
        res.send(req.file.url)
    }
    else{
        res.status = 401;
        res.send("You cannot attach pictures to other ppl posts")
    }
})


module.exports = router;