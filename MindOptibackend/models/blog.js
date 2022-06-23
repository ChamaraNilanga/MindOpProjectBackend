const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/blogcontroller");
const controller1 = require("../routes/blogcommentscontroller");
const {uploadFile} = require("../s3");
const multer = require('multer');
const upload =multer({dest:"uploads/"});

app.use(express.json());
app.use((req,res,next)=>{
next();
});

router.get("/", controller.getblogs);
router.get("/byblogid/:bid",controller.getblogbyid);
router.get("/user/:uid",controller.getblogbyuser);
router.get("/getblogbody/:key",controller.getblogbody);
router.get("/:string", controller.searchedblog);
// router.post("/", controller.addblog);
router.put("/updateblog/:id",controller.updateblog);
router.delete("/:id",controller.deleteblog);
router.post("/addblog/:uid",upload.single('image'),controller.addblog);
router.post("/comment/:uid&:bid",controller1.createblogcomment);
router.get("/comment/:cid",controller1.getcommentslist);
router.delete("/comment/:id",controller1.deletecomments);

// router.delete("router.get("/", controller.getblog);",controller.deleteblog);
// router.put("/updateblog/:id",controller.updateblog);

   

module.exports=router;