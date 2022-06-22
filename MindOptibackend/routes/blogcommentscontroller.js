const pool = require("../db");



//create comments
const createblogcomment=async(req,res)=>{
    const bid=req.params.bid;
    const uid=req.params.uid; 
    const {commentbody}=req.body;
    await pool.query("INSERT INTO blog_comment (commentbody,blogid,commenterid,postedtime) VALUES ($1,$2,$3,CURRENT_TIMESTAMP)",[commentbody,bid,uid],(error,results)=>{
        if(error) throw error;
        res.status(200).send("added comment");
    });
};

//get blog comments
const getcommentslist=async(req,res)=>{
    const cid=req.params.cid;
    await pool.query("SELECT bcommentid,commentbody,blogid,commenterid,postedtime FROM blog_comment WHERE blogid=$1",[cid],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

//delete blog comments
const deletecomments=async(req,res)=>{
    const id=req.params.id;
    await pool.query("SELECT bcommentid FROM blog_comment WHERE bcommentid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM blog_comment WHERE bcommentid=$1",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).send("comment deleted");
            });
        }else{
            res.status(400).send("No comment to delete"); 
        }
    });
};




module.exports = {
    createblogcomment,
    getcommentslist,
    deletecomments,
};