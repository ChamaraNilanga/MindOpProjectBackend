const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/questioncontroller");


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.post("/createquestion/:id", controller.createQuestion1);
router.get("/displayquestion", controller.getQuestion);
router.delete("/deletequestion/:id",controller.deleteQuestion);
router.put("/editquestion/:id",controller.editQuestion);
router.get("/searchequestion/:key",controller.searchequestion);
router.get("/searchequestion2/:key",controller.searchequestion2);



module.exports=router;