const pool = require("../db");

//create Question MCQ
const createQuestion1 = async(req,res) => {
    const { text} =req.body;
    const { mrk} =req.body;
    const { qname} =req.body;
    const { answer01} =req.body;
    const { answer02} =req.body;
    const { answer03} =req.body;
    const { answer04} =req.body;
    const qtype=req.params.qtype; 
    const catID=req.params.catID; 
    await pool.query("SELECT type_ FROM QuizQuestion WHERE type_=$1 ",[qtype],(error,results)=>{
       if (results.rows.length){
           res.send("Question type is MCQ");
       }else{
       pool.query("INSERT INTO QuizQuestion (mark,createdDate,QuestionName,LastModifiedDate,QuestionText,CreatedTime,QuestionCategoryID,Answer01,Answer02,Answer03,Answer04) values ($1,CURRENT_TIMESTAMP,$2,CURRENT_TIMESTAMP,$3,CURRENT_TIMESTAMP,$4,$5,$6,$7,$8)",[mrk,qname,text,catID,answer01,answer02,answer03,answer04],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("added question");
       
       });
     }
   });

};

//create Question True or false
const createQuestion2 = async(req,res) => {
    const { text} =req.body;
    const { mrk} =req.body;
    const { qname} =req.body;
    const qtype=req.params.qtype; 
    const catID=req.params.catID; 
    await pool.query("SELECT type_ FROM QuizQuestion WHERE type_=$1 ",[qtype],(error,results)=>{
       if (results.rows.length){
           res.send("Question type is MCQ");
       }else{
       pool.query("INSERT INTO QuizQuestion (mark,createdDate,QuestionName,LastModifiedDate,QuestionText,CreatedTime,QuestionCategoryID) values ($1,CURRENT_TIMESTAMP,$2,CURRENT_TIMESTAMP,$3,CURRENT_TIMESTAMP,$4)",[mrk,qname,text,catID],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("added question");
       
       });
     }
   });

};

//create Question Drag and Drop
const createQuestion3 = async(req,res) => {
    const { text} =req.body;
    const { mrk} =req.body;
    const { qname} =req.body;
    const qtype=req.params.qtype; 
    const catID=req.params.catID; 
    await pool.query("SELECT type_ FROM QuizQuestion WHERE type_=$1 ",[qtype],(error,results)=>{
       if (results.rows.length){
           res.send("Question type is MCQ");
       }else{
       pool.query("INSERT INTO QuizQuestion (mark,createdDate,QuestionName,LastModifiedDate,QuestionText,CreatedTime,QuestionCategoryID) values ($1,CURRENT_TIMESTAMP,$2,CURRENT_TIMESTAMP,$3,CURRENT_TIMESTAMP,$4)",[mrk,qname,text,catID],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("added question");
       
       });
     }
   });

};




//display all questions
const getQuestion = async(req,res) => {
    await pool.query("SELECT * FROM QuizQuestion",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//delete Question
const deleteQuestion= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT QID FROM QuizQuestion WHERE QID=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any question relevent to that ID");
        }else{
            pool.query("DELETE FROM QuizQuestion WHERE QID=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Question Deleted");
            });
        }

    });

 };

//edit question
const editQuestion=async(req,res)=>{
    const id=req.params.qid;
    const {mark,qtext,qname}=req.body;
    pool.query("SELECT QID FROM QuizQuestion WHERE QID=$1 ",[id],(error,results)=>{
       if (!results.rows.length){
           res.send("No any Question relevent to that ID");
       }else{
           pool.query("UPDATE QuizQuestion SET Mark=$1,QuestionText=$2,QuestionName=$3  WHERE QID=$4 ",[mark,qtext,qname,id],(error,results)=>{
               if(error)throw error;
               res.status(201).send("Question Updated");
           });
       }

   });

};

//get searched question (Search by question name)
const searchequestion = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM QuizQuestion WHERE QuestionName=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

//get searched question (Search by tags)
const searchequestion2 = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM QuizQuestion WHERE Tag=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};





module.exports = {
    createQuestion1,
    getQuestion,
    deleteQuestion,
    editQuestion,
    searchequestion,
    searchequestion2,
 };