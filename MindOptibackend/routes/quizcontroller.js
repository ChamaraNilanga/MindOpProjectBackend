const pool = require("../db");

//create Quiz Activity
const createQuiz = async(req,res) => {
    const { quizname} =req.body;
    const { quizdes} =req.body;
    const { grade} =req.body;
    const { navimethod} =req.body;
    const { layout} =req.body;
    const { availability} =req.body;
    const { timelimit} =req.body;
    const quizID=req.params.qid; 
    const contentID=req.params.cid; 
    await pool.query("SELECT QuizID FROM Quiz WHERE QuizID=$1 ",[quizID],(error,results)=>{
       if (results.rows.length){
           res.send("Quiz activity is already added");
       }else{
       pool.query("INSERT INTO Quiz (QuizID,QuizName,Description_,TimeLimit,Grade,NaviMethod,Layout,Availability,ContentID) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)",[quizID,quizname,quizdes,timelimit,grade,navimethod,layout,availability,contentID],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("Quiz activity created");
       
       });
     }
   });

};


//display quiz activity
const displayQuiz = async(req,res) => {
    await pool.query("SELECT * FROM Quiz",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};


//get searched quiz (by quiz name)
const searchQuiz = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM Quiz WHERE QuizName=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

//get searched quiz (by quizID)
const searchQuiz2 = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM Quiz WHERE QuizID=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

//delete Quiz
const deleteQuiz= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT QuizID FROM Quiz WHERE QuizID=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any Quiz activity relevent to that ID");
        }else{
            pool.query("DELETE FROM Quiz WHERE QuizID=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Quiz activity Deleted");
            });
        }

    });

 };

//edit Quiz activity
const editQuiz=async(req,res)=>{
    const id=req.params.qid;
    const contentID=req.params.cid; 
    const {qname,quizdes,timelimit,grade,navimethod,layout,availability}=req.body;
    pool.query("SELECT QuizID FROM Quiz WHERE QuizID=$1 ",[id],(error,results)=>{
       if (!results.rows.length){
           res.send("No any Quiz Activity to that ID");
       }else{
           pool.query("UPDATE Quiz SET QuizName=$1,Description_=$2,TimeLimit=$3,Grade=$4,NaviMethod=$5,Layout=$6,Availability=$7,ContentID=$8  WHERE QuizID=$9 ",[qname,quizdes,timelimit,grade,navimethod,layout,availability,contentID,id],(error,results)=>{
               if(error)throw error;
               res.status(201).send("Quiz Activity Updated");
           });
       }

   });

};









module.exports = {
    createQuiz,
    displayQuiz,
    searchQuiz,
    searchQuiz2,
    deleteQuiz,
    editQuiz,
 };