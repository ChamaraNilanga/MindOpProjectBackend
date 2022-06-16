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
router.get("/:id", controller.getsinglecourses);
router.post("/", controller.addCourse);
router.get("/enroll/:id",controller.conductorenrollcourse);
router.get("/studentreq/:modid",controller1.getreqformodule);
router.get("/teacherreqlist/",controller1.getteacherrequestlist);
router.get("/:key",controller.searchedcourses);
router.get("/completedcourses/:sid",controller.studentfinishedcourses);
router.put("/teacherreqaccept/:admin&:tid&:modid",controller1.acceptteacherrequest);
router.put("/studentreqaccept/:accid&:sid&:modid",controller1.acceptstudentrequest);
router.delete("/:id",controller.deleteCourse);
router.delete("/teacherrequest/:tid&:modid",controller1.removeteacher);
router.put("/:id",controller.updateCourse);
router.get("/studentsincourse/:modid",controller.studentincourse);
router.put("/studentprogress/:sid&:modid",controller.updateprogress);
router.get("/studentenroll/:sid",controller1.getcoursesstudentrequorenr);
router.post("/teacherrequest/:tid&:modid",controller1.teacherrequest);
router.post("/studentenroll/:sid&:modid",controller1.studentenrollrequest);
router.delete("/studentenroll/:sid&:modid",controller1.removestudent);



//elasticgreenstore/neflyfy

module.exports=router;