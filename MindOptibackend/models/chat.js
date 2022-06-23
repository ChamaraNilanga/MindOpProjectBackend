const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/chatcontroller");



app.use(express.json());
app.use((req,res,next)=>{
    next();
});


router.post("/:sid&:rid", controller.sendMessage);
router.delete("/:cid",controller.deleteMessage);
router.get("/chat/:sid&:rid",controller.getMessage);
router.get("/chat/:rid",controller.getMessageByReceiverId);
router.post("/:sid",controller.sendReply);


module.exports=router;