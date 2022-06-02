const pool = require("../db");

//get assignment
const getassignment = async(req,res) => {
    await pool.query("SELECT * FROM Assignment",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//add assignment
        const addassignment = async(req,res) => {
            const {assignmentnam,duedat,intro,contid} =req.body;
            
            await pool.query("INSERT INTO Assignment(name_,Introduction,ContentID,DueDate,CreateTime) values ($1,$2,$3,$4,CURRENT_TIMESTAMP)",[assignmentnam,intro,contid,duedat],(error,results)=>{
                   if (error) throw  error;
                   res.status(200).send("Assignment created");
           });
       
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
     const {assignmentnam,duedat,intro,contid}=req.body;
     pool.query("SELECT AssignmentID FROM Assignment WHERE AssignmentID=$1 ", [id], (error, results) => {
         if (!results.rows.length) {
             res.send("NO Assignment");
         } else {
             pool.query("UPDATE Assignment SET name_=$1,Introduction=$2,ContentID=$3,DueDate=$4 WHERE AssignmentID=$5 ", [assignmentnam, intro, contid, duedat, id], (error, results) => {
                 if (error)
                     throw error;
                 res.status(201).send("Assignment details Updated");
             });
         }

     });

 };



module.exports = {
    getassignment,
    addassignment,
    deleteAssignmnet,
    updateassignment
};