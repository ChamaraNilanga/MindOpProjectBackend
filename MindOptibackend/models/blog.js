const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/blogcontroller");

app.use(express.json());
app.use((req,res,next)=>{
next();
});

router.get("/", controller.getblogs);
router.get("/:key", controller.searchedblog);
router.post("/", controller.addblog);
router.put("/updateblog/:id",controller.updateblog);
router.delete("/:id",controller.deleteblog);

// router.delete("router.get("/", controller.getblog);",controller.deleteblog);
// router.put("/updateblog/:id",controller.updateblog);

   

module.exports=router;