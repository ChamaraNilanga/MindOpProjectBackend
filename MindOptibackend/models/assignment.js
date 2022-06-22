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


    

module.exports=router;