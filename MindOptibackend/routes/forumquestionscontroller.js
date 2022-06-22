const pool = require("../db");
const {uploadFile,getFileStream } = require("../s3");
const multer = require('multer');
const upload =multer({dest:"uploads/"});
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

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
/*in the questions we need to upload delete images so this part should update according to it */
//create questions
const createforumquestion=async(req,res)=>{
    const catid=req.params.catid;
    const uid=req.params.uid; 
    const {question}=req.body;
    const file=req.file;
    //console.log(file);
    if(file){
    const results=await uploadFile(file);//s3.js function used in here
    //console.log(results);
    //res.send("success");
    if(results){
        const image=results.key;
        await unlinkFile(file.path);
        pool.query("INSERT INTO forum_question (name_,fcategoryid,managetime,userid,image) VALUES ($1,$2,CURRENT_TIMESTAMP,$3,$4)",[question,catid,uid,image],(error,results)=>{
            if(error) throw error;
            res.status(200).send("added question");
        
        });
    }else{
        res.status(400).send("unable to added question");
    }
    }else{
        pool.query("INSERT INTO forum_question (name_,fcategoryid,managetime,userid) VALUES ($1,$2,CURRENT_TIMESTAMP,$3)",[question,catid,uid],(error,results)=>{
            if(error) throw error;
            res.status(200).send("added question");
        
        });
    }
    
};

//get forum questions
const getquestionlist=async(req,res)=>{
    const catid=req.params.cid;
    await pool.query("SELECT fquestionid,name_,managetime,userid,image FROM forum_question WHERE fcategoryid=$1",[catid],(error,results)=>{
        if(results.rows.length){
            res.status(200).json(results.rows);
        }else{
            res.status(400).send("No any question related to this category");
        }
    });
};

//delete forum question
const deletequestion=async(req,res)=>{
    const id=req.params.id;
    await pool.query("SELECT fquestionid FROM forum_question WHERE fquestionid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM forum_question WHERE fquestionid=$1",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).send("question deleted");
            });
        }else{
            res.status(400).send("No question to delete");
        }
    });
};
//get my list
const getmylist=async(req,res)=>{
    const userid=req.params.userid;
    await pool.query("SELECT * FROM forum_question WHERE userid=$1",[userid],(error,results)=>{
        if(results.rows.length){
            res.status(200).json(results.rows);
        }else{
            res.status(400).send("No any question related to this user");
        }
    });
};


//search questions
const searchforumques = async(req,res) => {
    const key= req.params.key;
    const cid=req.params.id;
     await pool.query("SELECT fquestionid,name_,managetime,userid FROM forum_question WHERE name_ LIKE '%' || $1 || '%' AND fcategoryid=$2",[key,cid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};
//get image
const getImage=async(req, res) => {
    const key = req.params.key
    await pool.query("SELECT image FROM forum_question WHERE fquestionid=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
  }
  


module.exports = {
    addcategory,
    getcategories,
    deletecategory,
    createforumquestion,
    getquestionlist,
    deletequestion,
    searchforumques,
    getmylist,
    getImage,
};