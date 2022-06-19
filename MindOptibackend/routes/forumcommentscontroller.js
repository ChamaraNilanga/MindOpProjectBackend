const pool = require("../db");


/*in the questions we need to upload delete images so this part should update according to it */
//create comments
const createforumcomment=async(req,res)=>{
    const qid=req.params.qid;
    const uid=req.params.uid; 
    const {comment}=req.body;
    await pool.query("INSERT INTO forum_comment (body,postedtime,fquestionid,commenterid) VALUES ($1,CURRENT_TIMESTAMP,$2,$3)",[comment,qid,uid],(error,results)=>{
        if(error) throw error;
        res.status(200).send("added comment");
    });
};

//get forum comments
const getcommentslist=async(req,res)=>{
    const cid=req.params.cid;
    await pool.query("SELECT f.fcommentid,f.body,f.postedtime,f.fquestionid,f.commenterid,u.username FROM forum_comment f,user_ u WHERE fquestionid=$1 AND u.userid=f.commenterid",[cid],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

//delete forum comments
const deletecomments=async(req,res)=>{
    const id=req.params.id;
    await pool.query("SELECT fcommentid FROM forum_comment WHERE fcommentid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM forum_comment WHERE fcommentid=$1",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).send("comment deleted");
            });
        }else{
            res.status(400).send("No comment to delete");
        }
    });
};

//create subcomments
const createforumsubcomment=async(req,res)=>{
    const cid=req.params.cid;
    const uid=req.params.uid; 
    const {comment}=req.body;
    await pool.query("INSERT INTO forum_sub_comment (body,fcommentid,postedtime,subcomid) VALUES ($1,$2,CURRENT_TIMESTAMP,$3)",[comment,cid,uid],(error,results)=>{
        if(error) throw error;
        res.status(200).send("added subcomment");
    });
};
//get forum subcomments
const getsubcommentslist=async(req,res)=>{
    const cid=req.params.cid;
    await pool.query("SELECT fsubcommentid,body,postedtime,fcommentid,subcomid FROM forum_sub_comment WHERE fcommentid=$1",[cid],(error,results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

//delete forum subcomments
const deletesubcomments=async(req,res)=>{
    const id=req.params.id;
    await pool.query("SELECT fsubcommentid FROM forum_sub_comment WHERE fsubcommentid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM forum_sub_comment WHERE fsubcommentid=$1",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).send("subcomment deleted");
            });
        }else{
            res.status(400).send("No subcomment to delete");
        }
    });
};


module.exports = {
    createforumcomment,
    getcommentslist,
    deletecomments,
    createforumsubcomment,
    getsubcommentslist,
    deletesubcomments,
};