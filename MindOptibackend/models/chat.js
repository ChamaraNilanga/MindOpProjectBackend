const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/chatcontroller");



app.use(express.json());
app.use((req,res,next)=>{
    next();
});


router.post("/:sid&:tid", controller.sendMessage);
router.delete("/:id",controller.deleteMessage);
router.get("/:sid&:rid",controller.getMessage);


module.exports=router;