const pool = require("../db");
const {uploadFile} = require("../s3");
const multer = require('multer');
const upload =multer({dest:"uploads/"});

//get all blogs
const getblogs = async(req,res) => {
    await pool.query("SELECT * FROM blog",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//get blog by blog id
const getblogbyid = async(req,res) => {
    const bid= req.params.bid;
    await pool.query("SELECT * FROM blog WHERE blogid=$1",[bid],(error,results)=>{
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};


//get blog by user id
const getblogbyuser = async(req,res) => {
    const uid= req.params.uid;
    await pool.query("SELECT * FROM blog WHERE userid=$1",[uid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};



const getblogbody = async(req,res) => {
    const key= req.params.key;
    await pool.query("SELECT body FROM blog where blogid=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};



//get searched blog (Regex)
const searchedblog = async(req,res) => {
    const string= req.params.string;
     await pool.query("SELECT * FROM blog WHERE body ~* $1",[string],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};


//add blog
const addblog = async(req,res) => {
    const bid= req.params.bid;
    const uid=req.params.uid; 
    const {blogtitle,body}=req.body;
    const file=req.file;

   if(file){
    const results=await uploadFile(file);
    if(results){
        const image=results.Location;
        pool.query("INSERT INTO blog (blogtitle,body,userid,managetime,image) VALUES ($1,$2,$3,CURRENT_TIMESTAMP,$4)",[blogtitle,body,uid,image],(error,results)=>{
            if(error) throw error;
            res.status(200).send("added blog");
        
        });
    }else{
        res.status(400).send("unable to added blog");
    }
   }
  else{
    pool.query("INSERT INTO blog (blogtitle,body,userid,managetime) VALUES ($1,$2,$3,CURRENT_TIMESTAMP)",[blogtitle,body,uid],(error,results)=>{
        if(error) throw error;
        res.status(200).send("added blog");
    
    });
  }

    //check already added
//     await pool.query("SELECT blogid FROM blog WHERE blogid=$1",[bid],(error,results)=>{
//        if (results.rows.length){
//            res.send("Already added");
//        }else{
//        pool.query("INSERT INTO blog (blogtitle,body,userid,managetime) values ($1,$2,$3,CURRENT_TIMESTAMP)",[blogtitle,body,uid],(error,results)=>{
//            if (error) throw  error;
//            res.status(200).send("Added a blog");
       
//        });
//      }
//    });
}; 

//update blog
 const updateblog=async(req,res) => {
     const id=req.params.id;
     const {btit,blogbody,user}=req.body;
     pool.query("SELECT blogid FROM blog WHERE blogid=$1" , [id], (error, results) => {
         if (!results.rows.length) {
             res.send("Haven't any blog for this id");
         } else {
             pool.query("UPDATE blog SET blogtitle=$1,body=$2,userid=$3 WHERE blogid=$4" , [btit, blogbody, user,id], (error, results) => {
                 if (error) throw error;
                 res.status(201).send("Blog details Updated");
             });
         }

     });

 };

//  delete blog
 const deleteblog = async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT blogid FROM blog WHERE blogid =$1" ,[id],(error,results) =>{
        if (!results.rows.length){
            res.send("Haven't any blog for this id");
        }else{
            pool.query("DELETE FROM blog WHERE blogid=$1" ,[id],(error,results) => {
                if(error)throw error;
                res.status(201).send("Blog Deleted");
            });
        }

    });

 };




module.exports = {
    getblogs,
    getblogbyid,
    getblogbyuser,
    getblogbody,
    searchedblog,
    addblog,
    updateblog,
    deleteblog
    
}