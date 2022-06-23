const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/assignmentcontroller");

app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.get("/", controller.getassignment);
router.post("/", controller.addassignment);
router.delete("/:id",controller.deleteAssignmnet);
router.put("/updateassignment/:id",controller.updateassignment);
router.get("/getassignment/:id", controller.getoneassignment);
router.get("/attemptassignment/:id", controller.attemptassignment);
router.post("/attemptassignment02", controller.attemptassignment02);


module.exports=router;