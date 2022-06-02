const pool = require("../db");

//get all blogs
const getblogs = async(req,res) => {
    await pool.query("SELECT * FROM blog",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};



//get searched blog
const searchedblog = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM blog WHERE blogtitle=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};



//add blog
const addblog = async(req,res) => {
    const bid= req.params.bid;
    const { blogtitle,body,userid} =req.body;
    //check already added
    await pool.query("SELECT blogid FROM blog WHERE blogid=$1",[bid],(error,results)=>{
       if (results.rows.length){
           res.send("Already added");
       }else{
       pool.query("INSERT INTO blog (blogtitle,body,userid,managetime) values ($1,$2,$3,CURRENT_TIMESTAMP)",[blogtitle,body,userid],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("Added a blog");
       
       });
     }
   });
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
    searchedblog,
    addblog,
    updateblog,
    deleteblog
}