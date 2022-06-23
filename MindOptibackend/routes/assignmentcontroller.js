const pool = require("../db");
const {uploadFile,getFileStream } = require("../s3");
const multer = require('multer');
const upload =multer({dest:"uploads/"});
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
//get assignment
const getassignment = async(req,res) => {
    await pool.query("SELECT * FROM Assignment",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};


//get a assignment
const getoneassignment = async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT * FROM Assignment WHERE AssignmentID=$1",[id],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};


// //add assignment
//         const addassignment = async(req,res) => {
//             const {assignmentnam,duedat,intro,contid,timelimit} =req.body;
            
//             await pool.query("INSERT INTO Assignment(name_,Introduction,ContentID,DueDate,timelimit,CreateTime) values ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)",[assignmentnam,intro,contid,duedat,timelimit],(error,results)=>{
//                    if (error) throw  error;
//                    res.status(200).send("Assignment created");
//            });
       
//         };
////////////////
        const addassignment=async(req,res)=>{
            const {assignmentnam,duedat,intro,contid,timelimit} =req.body;
            const file=req.file;
            //console.log(file);
            if(file){
            const results=await uploadFile(file);//s3.js function used in here
            //console.log(results);
            //res.send("success");
            if(results){
                const image=results.key;
                await unlinkFile(file.path);
                pool.query("INSERT INTO Assignment(name_,Introduction,ContentID,DueDate,timelimit,submission,CreateTime) values ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP)",[assignmentnam,intro,contid,duedat,timelimit,image],(error,results)=>{
                    if(error) throw error;
                    res.status(200).send("Assignment created");
                });
            }else{
                res.status(200).send("unable to create assignment");
            }
            }else{
                pool.query("INSERT INTO Assignment(name_,Introduction,ContentID,DueDate,timelimit,CreateTime) values ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP)",[assignmentnam,intro,contid,duedat,timelimit],(error,results)=>{
                    if(error) throw error;
                    res.status(200).send("added Assignment");
                
                });
            }
            
        };



//delete Assignment
 const deleteAssignmnet= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT name_ FROM Assignment WHERE AssignmentID=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any assignment");
        }else{
            pool.query("DELETE FROM Assignment WHERE AssignmentID=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Assignmnet Deleted");
            });
        }

    });

 };


//update Assignmnet
 const updateassignment=async(req,res)=>{
     const id=req.params.id;
     const {assignmentnam,duedat,intro,timelimit}=req.body;
     pool.query("SELECT AssignmentID FROM Assignment WHERE AssignmentID=$1 ", [id], (error, results) => {
         if (!results.rows.length) {
             res.send("NO Assignment");
         } else {
             pool.query("UPDATE Assignment SET name_=$1,Introduction=$2,DueDate=$3,timelimit=$4 WHERE AssignmentID=$5 ", [assignmentnam, intro, duedat, timelimit, id], (error, results) => {
                 if (error)
                     throw error;
                 res.status(201).send("Assignment details Updated");
             });
         }

     });

 };


 //attempt assignment part 01
 const attemptassignment = async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT * FROM Assignment WHERE AssignmentID=$1",[id],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//Attetpt Assignment

const attemptassignment02 = async(req,res) => {
    const {assignmentid,studentid} =req.body;
    
    await pool.query("INSERT INTO AssignmentAttempt(AssignmentID,StudentID,AttemptTime) values ($1,$2,CURRENT_TIMESTAMP)",[assignmentid,studentid],(error,results)=>{
           if (error) throw  error;
           res.status(200).send("Assignment attempt created");
   });

};

//add submission


// const addsubmission = async(req,res) => {
//     const {assignmentid,studentid} =req.body;
    
//     await pool.query("UPDATE AssignmentAttempt SET AssignmentAttempt  submission Attempt S  INSERT INTO AssignmentAttempt(AssignmentID,StudentID,) values ($1,$2,CURRENT_TIMESTAMP)",[assignmentid,studentid],(error,results)=>{
//            if (error) throw  error;
//            res.status(200).send("Assignment attempt created");
//    });

// };




module.exports = {
    getassignment,
    addassignment,
    deleteAssignmnet,
    updateassignment,
    getoneassignment,
    attemptassignment,
    attemptassignment02
};