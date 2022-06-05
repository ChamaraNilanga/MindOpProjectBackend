const pool = require("../db");

//add category
const addCategory = async(req,res) => {
    const { catname,catID } =req.body;
    //check already added
    await pool.query("SELECT CategoryName FROM QuestionCategory WHERE CategoryName=$1 OR CategoryID=$2",[catname,catID],(error,results)=>{
       if (results.rows.length){
           res.send("Already added");
       }else{
       pool.query("INSERT INTO QuestionCategory (CategoryName,CategoryID) values ($1,$2)",[catname,catID],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("added category");
       
       });
     }
   });

};

//display all categories
const getCategory = async(req,res) => {
    await pool.query("SELECT * FROM QuestionCategory",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//delete category
const deleteCategory= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT CategoryID FROM QuestionCategory WHERE CategoryID=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any category relevent to that ID");
        }else{
            pool.query("DELETE FROM QuestionCategory WHERE CategoryID=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Category Deleted");
            });
        }

    });

 };

 //edit category
 const editCategory=async(req,res)=>{
    const id=req.params.id;
    const { catname }=req.body;
    await pool.query("SELECT CategoryID FROM QuestionCategory WHERE CategoryID=$1 ",[id],(error,results)=>{
       if (!results.rows.length){
           res.send("No any category relevent to that ID");
       }else{
           pool.query("UPDATE QuestionCategory SET CategoryName=$1 WHERE CategoryID=$2 ",[catname,id],(error,results)=>{
               if(error)throw error;
               res.status(201).send("Category Updated");
           });
       }

   });

};

//get searched category
const searchcategory = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM QuestionCategory WHERE CategoryID LIKE '%' || $1 || '%'",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//add sub category
const addSubCategory = async(req,res) => {
    const catid=req.params.id;
    const { subcatname,subcatID } =req.body;
    //check already added
    await pool.query("SELECT SubCatName FROM QuestionSubCategory WHERE SubCatName=$1 OR QuestionSubCategoryID=$2",[subcatname,subcatID],(error,results)=>{
       if (results.rows.length){
           res.send("Already added");
       }else{
       pool.query("INSERT INTO QuestionSubCategory (QuestionSubCategoryID,SubCatName,CategoryID) values ($1,$2,$3)",[subcatID,subcatname,catid],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("added sub category");
       
       });
     }
   });

};

//display all sub categories
const getSubCategory = async(req,res) => {
    await pool.query("SELECT * FROM QuestionSubCategory",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//delete sub category
const deleteSubCategory= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT QuestionSubCategoryID FROM QuestionSubCategory WHERE QuestionSubCategoryID=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any sub category relevent to that ID");
        }else{
            pool.query("DELETE FROM QuestionSubCategory WHERE QuestionSubCategoryID=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Sub category Deleted");
            });
        }

    });

 };


 //edit sub category
 const editSubCategory=async(req,res)=>{
    const id=req.params.id;
    const { subcatname }=req.body;
    await pool.query("SELECT QuestionSubCategoryID FROM QuestionSubCategory WHERE QuestionSubCategoryID=$1 ",[id],(error,results)=>{
       if (!results.rows.length){
           res.send("No any category relevent to that ID");
       }else{
           pool.query("UPDATE QuestionSubCategory SET SubCatName =$1 WHERE QuestionSubCategoryID=$2 ",[subcatname,id],(error,results)=>{
               if(error)throw error;
               res.status(201).send("Sub category Updated");
           });
       }

   });

};

//get searched sub category
const searchsubcategory = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM QuestionSubCategory WHERE QuestionSubCategoryID LIKE '%' || $1 || '%'",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

module.exports = {
   addCategory,
   getCategory,
   deleteCategory,
   editCategory,
   addSubCategory,
   getSubCategory,
   deleteSubCategory,
   editSubCategory,
   searchcategory,
   searchsubcategory,
    
};
