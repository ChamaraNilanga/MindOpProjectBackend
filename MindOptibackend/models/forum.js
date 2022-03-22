const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/forumquestionscontroller");


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.post("/category",controller.addcategory);
router.post("/question/:catid&:uid",controller.createforumquestion);
router.get("/category",controller.getcategories);
router.delete("/category/:id",controller.deletecategory);



//elasticgreenstore/neflyfy

module.exports=router;