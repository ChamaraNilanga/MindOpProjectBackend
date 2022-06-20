const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/paymentcontroller");


app.use(express.json());
app.use((req,res,next)=>{
next();
});

router.post("/payment", controller.setPayment);


// router.delete("router.get("/", controller.getblog);",controller.deleteblog);
// router.put("/updateblog/:id",controller.updateblog);

   

module.exports=router;