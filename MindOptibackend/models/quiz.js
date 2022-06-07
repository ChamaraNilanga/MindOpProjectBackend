const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/quizcontroller");


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.post("/createquizactivity/:qid&:cid", controller.createQuiz);
router.get("/displayquizactivity", controller.displayQuiz);
router.get("/searchquizactivity/:key",controller.searchQuiz);
router.get("/searchquizactivity2/:key",controller.searchQuiz2);
router.delete("/deletequizactivity/:id",controller.deleteQuiz);
router.put("/editquizactivity/:qid&:cid",controller.editQuiz);
router.post("/attemptquizactivity/:qid&:sid", controller.attemptQuiz);


module.exports=router;



