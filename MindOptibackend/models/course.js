const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/coursecontroller");
const controller1= require("../routes/enrollcontroller");

app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.get("/", controller.getcourses);
router.post("/", controller.addCourse);
router.get("/:key",controller.searchedcourses);
router.delete("/:id",controller.deleteCourse);
router.put("/:id",controller.updateCourse);
router.get("/studentenroll/:sid",controller1.getcoursesstudentrequorenr);


module.exports=router;