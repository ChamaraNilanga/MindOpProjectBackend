const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/quizcontroller");


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.post("/createquizactivity/:cid", controller.createQuiz);
router.get("/displayquizactivity", controller.displayQuiz);
router.get("/searchquizactivity/:key",controller.searchQuiz);
router.get("/searchquizactivity2/:key",controller.searchQuiz2);
router.delete("/deletequizactivity/:id",controller.deleteQuiz);
router.put("/editquizactivity/:qid&:cid",controller.editQuiz);

router.post("/attemptquizactivity/:qid&:sid", controller.attemptQuiz);
router.delete("/deleteattempt/:qid&:sid", controller.deleteAttempt);
router.get("/displayallattempts",controller.displayAllAttempts);
router.get("/searchattempt/:qid&:sid",controller.searchattempt);

router.get("/displaystudentanswers", controller.displayAllStudentAnswers);
router.get("/displayanswersofonestudent/:sid", controller.displayAnswersofOneStudent);
router.get("/displaystudentanswersforaquestion/:qid", controller.displayStudentAnswersForaQuestion);

router.get("/viewgradereport/:qid", controller.gradeReport);
router.get("/viewresponsesreport/:qid", controller.responsesReport);


module.exports=router;



