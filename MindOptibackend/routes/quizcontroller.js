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
    const {quizID}=req.body; 
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

//Students attempt quizzes
const attemptQuiz=async(req,res)=>{
    const QuizID=req.params.qid;
    const StudentID=req.params.sid; 
    const Finalgrade=req.params.finalgrade; 
    const {attempttime,attemptdate}=req.body;
    pool.query("SELECT QuizID,StudentID FROM QuizAttempt WHERE QuizID=$1 AND StudentID=$2 ",[QuizID,StudentID],(error,results)=>{
       if (!results.rows.length){
        pool.query("INSERT INTO QuizAttempt (QuizID,StudentID,AttemptTime,AttemptDate,SubmittedTime,Finalgrade) VALUES ($1,$2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$3)",[QuizID,StudentID,Finalgrade],(error,results)=>{
            if(error)throw error;
            res.status(201).send("Student attempt recorded");
        });
          
       }else{
        res.send("Student attempted the Quiz Activity");
       }

   });

}; 
//Delete Student attempt

const deleteAttempt= async(req,res) => {
    const QuizID=req.params.qid;
    const StudentID=req.params.sid; 
    await pool.query("SELECT QuizID,StudentID FROM QuizAttempt WHERE QuizID=$1 AND StudentID=$2 ",[QuizID,StudentID],(error,results)=>{
        if (!results.rows.length){
            res.send("No any Attempt record");
        }else{
            pool.query("DELETE FROM QuizAttempt WHERE QuizID=$1 AND StudentID=$2 ",[QuizID,StudentID],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Attempt Deleted");
            });
        }

    });

 };

 //Display all attempts
 const displayAllAttempts = async(req,res) => {
    await pool.query("SELECT * FROM QuizAttempt",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//Search attempt
const searchattempt = async(req,res) => {
    const QuizID=req.params.qid;
    const StudentID=req.params.sid; 
     await pool.query("select QuizID,StudentID,AttemptTime,AttemptDate,SubmittedTime,Finalgrade from QuizAttempt where QuizID=$1 and StudentID=$2",[QuizID,StudentID],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};




//Diplay student answers
const displayAllStudentAnswers=async(req,res)=>{
    
    await pool.query("SELECT * FROM StudentAnswer  ",(error,results)=>{
       
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

//Display the question's answers given by one student
const displayAnswersofOneStudent=async(req,res)=>{
    const StudentID=req.params.sid;
    await pool.query("SELECT * FROM StudentAnswer WHERE  StudentID=$1 ",[StudentID],(error,results)=>{
       
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

//Display Student Answers for a selected question
const displayStudentAnswersForaQuestion=async(req,res)=>{
    const QID=req.params.qid;
    await pool.query("select StudentID,GivenAnswer from StudentAnswer where QID=$1",[QID],(error,results)=>{
       
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};

// Grader report
const gradeReport=async(req,res)=>{
    const QuizID=req.params.qid;
    await pool.query("select s.StudentID,u.UserName,q.Finalgrade from Student s , User_ u , QuizAttempt q where s.StudentId=u.UserId and q.QuizID=$1",[QuizID],(error,results)=>{
       
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};
   
   // Responses report
const responsesReport=async(req,res)=>{
    const QuizID=req.params.qid;
    await pool.query("select u.UserName, sa.GivenAnswer, sa.status_ from Student s , User_ u , StudentAnswer sa, QuizAttempt q where s.StudentId=u.UserId and q.QuizID=$1",[QuizID],(error,results)=>{
       
        if (error) throw  error;
        res.status(200).json(results.rows);
        
    });
};


//Display Questions belongs to a Quiz
const displayQuestionsinaQuiz = async(req,res) => {
    const QuizID=req.params.quizid;
    // console.log('Hi...');
    await pool.query("select qhq.QuizID, qhq.QID, q.QuestionText, q.mark ,q.Answer01,q.Answer02,q.Answer03,q.Answer04 from QuizQuestion q , QuizHasQuizQuestion qhq where qhq.QID = q.QID and qhq.QuizID=$1",[QuizID],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//Display correct answers
const displayCorrectAnswers = async(req,res) => {
    await pool.query("SELECT * FROM CorrectAnswer",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};






module.exports = {
    createQuiz,
    displayQuiz,
    searchQuiz,
    searchQuiz2,
    deleteQuiz,
    editQuiz,
    attemptQuiz,
    displayAllStudentAnswers,
    displayAnswersofOneStudent,
    displayStudentAnswersForaQuestion,
    deleteAttempt,
    displayAllAttempts,
    searchattempt,
    gradeReport,
    responsesReport,
    displayQuestionsinaQuiz,
    displayCorrectAnswers,
    
 };