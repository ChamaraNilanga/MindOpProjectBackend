const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/forumquestionscontroller");
const controller1 = require("../routes/forumcommentscontroller");
const {uploadFile} = require("../s3");
const multer = require('multer');
const upload =multer({dest:"uploads/"});


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.get("/image/:key",controller.getImage);
router.post("/category",controller.addcategory);
router.post("/comment/:uid&:qid",controller1.createforumcomment);
router.post("/question/:catid&:uid",upload.single('image'),controller.createforumquestion);
router.post("/subcomment/:cid&:uid",controller1.createforumsubcomment);
router.get("/category",controller.getcategories);
router.get("/mylist/:userid",controller.getmylist);
router.get("/comment/:cid",controller1.getcommentslist);
router.get("/subcomment/:cid",controller1.getsubcommentslist);
router.get("/question/:cid",controller.getquestionlist);
router.get("/search/:key&:id",controller.searchforumques);
router.delete("/category/:id",controller.deletecategory);
router.delete("/question/:id",controller.deletequestion);
router.delete("/comment/:id",controller1.deletecomments);
router.delete("/subcomment/:id",controller1.deletesubcomments);


//elasticgreenstore/neflyfy

module.exports=router;