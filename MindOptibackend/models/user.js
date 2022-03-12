const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/usercontroller");

app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.get("/", controller.getusers);
router.post("/", controller.adduser);
router.delete("/:id",controller.deleteUser);
router.get("/userprofile/:key",controller.userpro);
router.get("/searcheduser/:key",controller.searcheduser);
router.put("/updateuser/:id",controller.updateuser);
    

module.exports=router;