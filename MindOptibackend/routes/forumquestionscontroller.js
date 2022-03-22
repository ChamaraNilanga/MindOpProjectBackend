const pool = require("../db");

//creating new forum category
const addcategory = async (req,res)=>{
    const {name}=req.body;
    await pool.query("SELECT name_ FROM forum_category WHERE name_=$1",[name],(error,results)=>{
        if(!results.rows.length){
            pool.query("INSERT INTO forum_category(name_) VALUES ($1)",[name],(error,results)=>{
                if(error) throw error;
                res.status(200).send("Category Added");
            });
        }else{
            res.status(200).send("Category already added");
        }
    });
};

//retreive category details
const getcategories=async(req,res)=>{
    await pool.query("SELECT fcategoryid,name_ FROM forum_category",(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

//delete category
const deletecategory=async(req,res)=>{
    const id=req.params.id;
    await pool.query("SELECT fcategoryid FROM forum_category WHERE fcategoryid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM forum_category WHERE fcategoryid=$1",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).send("Category deleted");
            });
        }else{
            res.status(400).send("No category to delete");
        }
    });
};

//create questions
const createforumquestion=async(req,res)=>{
    const catid=req.params.catid;
    const uid=req.params.uid; 
    const {question}=req.body;
    await pool.query("INSERT INTO forum_question (name_,fcategoryid,managetime,userid) VALUES ($1,$2,CURRENT_TIMESTAMP,$3)",[question,catid,uid],(error,results)=>{
        if(error) throw error;
        res.status(200).send("added question");
    });
};


module.exports = {
    addcategory,
    getcategories,
    deletecategory,
    createforumquestion,
    
};