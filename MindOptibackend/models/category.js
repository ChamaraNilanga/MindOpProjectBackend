const express = require("express");
const { Router } = require("express");
const router = Router();
const app = express(); 
const controller = require("../routes/categorycontroller");


app.use(express.json());
app.use((req,res,next)=>{
    next();
});

router.post("/addcategory", controller.addCategory);
router.get("/displaycategory",controller.getCategory);
router.put("/editcategory/:id",controller.editCategory);
router.delete("/deletecategory/:id",controller.deleteCategory);
router.post("/addsubcategory/:id",controller.addSubCategory);
router.get("/displaysubcategory",controller.getSubCategory);
router.delete("/deletesubcategory/:id",controller.deleteSubCategory);
router.put("/editsubcategory/:id",controller.editSubCategory);
router.get("/searchcategory/:key",controller.searchcategory);
router.get("/searchsubcategory/:key",controller.searchsubcategory);


module.exports=router;