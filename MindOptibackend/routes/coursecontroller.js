const pool = require("../db");

//get all courses
const getcourses = async(req,res) => {
    await pool.query("SELECT * FROM Module",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//get single courses
const getsinglecourses = async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT * FROM Module WHERE modid=$1",[id],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//get searched course
 const searchedcourses = async(req,res) => {
     const key= req.params.key;
      await pool.query("SELECT * FROM Module WHERE ModName LIKE '%' || $1 || '%'",[key],(error,results)=>{
         if (error) throw  error;
         res.status(200).json(results.rows);
     });
};

//add courses
 const addCourse = async(req,res) => {
     const { modname,descrip,star,end,adminid,modcode,price } =req.body;
     //check already added
     await pool.query("SELECT ModName FROM Module WHERE ModName=$1 OR ModCode=$2",[modname,modcode],(error,results)=>{
        if (results.rows.length){
            res.send("Already added");
        }else{
        pool.query("INSERT INTO Module (ModName,Descrip,sdate,enddate,adminid,modcode,price) values ($1,$2,$3,$4,$5,$6,$7)",[modname,descrip,star,end,adminid,modcode,price],(error,results)=>{
            if (error) throw  error;
            res.status(200).send("added course");
        
        });
      }
    });

 };

//delete course
 const deleteCourse= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT modcode FROM Module WHERE modid=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any course relevent to that code");
        }else{
            pool.query("SELECT e.moduleid FROM enrollmentrequest e WHERE e.moduleid=$1",[id],(error,results)=>{
                if(results.rows.length){
                    res.send("Course has conducting request");
                }else{
                    pool.query("SELECT modid FROM teacherrequests WHERE modid=$1",[id],(error,results)=>{
                        if(results.rows.length){
                            res.send("Course has enrollment request");
                        }else{
                            pool.query("DELETE FROM Module WHERE modid=$1 ",[id],(error,results)=>{
                                if(error)throw error;
                                res.status(201).send("Course Deleted");
                            });
                        }

                }
              )
            }
            
        }
      )
    };
})};


//update course
 const updateCourse=async(req,res)=>{
     const id=req.params.id;
     const { descrip,start,end }=req.body;
     await pool.query("SELECT modcode FROM Module WHERE modcode=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any course relevent to that code");
        }else{
            pool.query("UPDATE Module SET sdate=$1,enddate=$3,descrip=$4 WHERE modcode=$2 ",[start,id,end,descrip],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Course Updated");
            });
        }

    });

 };

 //student finish courses list
 const studentfinishedcourses=async (req,res)=>{
     const sid=req.params.sid;
     await pool.query("select modname,modcode,progress FROM Module m,enrollmentrequest e WHERE e.moduleid=m.modid AND e.studentid=$1 AND progress=100",[sid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
     });
 };

 //update progress of student
 const updateprogress =async(req,res)=>{
     const modid=req.params.modid;
     const sid=req.params.sid;
     const {progress}=req.body;
     await pool.query("SELECT requestedid FROM enrollmentrequest WHERE moduleid=$1 AND studentid=$2 AND isaccepted=true",[modid,sid],(error,results)=>{
         if(!results.rows.length){
            res.status(400).send("Not accepted or No any record");
         }else{
            pool.query("UPDATE enrollmentrequest SET progress=$1 WHERE moduleid=$2 AND studentid=$3",[progress,modid,sid],(error,results)=>{
                if (error) throw error;
                res.status(200).send("Updated Progress");
            });
         }
     });
 };

 //student in one course
 const studentincourse=async(req,res)=>{
     const modid=req.params.modid;
     await pool.query("SELECT modid FROM module WHERE modid=$1",[modid],(error,results)=>{
         if(results.rows.length){
             pool.query("SELECT e.studentid,e.progress,u.username,u.email FROM user_ u,enrollmentrequest e WHERE e.studentid=u.userid AND e.moduleid=$1 AND e.isaccepted=true",[modid],(error,results)=>{
                 if(error) throw error;
                 res.status(200).json(results.rows);
             });
         }else{
            res.status(400).send("Module cannot find");
         }
     });

 };

 //get conducting or enrolled courses
const conductorenrollcourse = async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT studentid FROM student WHERE studentid=$1",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("SELECT e.progress,m.modname,m.descrip,u.username,m.modcode FROM module m,enrollmentrequest e,user_ u,teacherrequests t WHERE t.tid=u.userid AND e.moduleid=m.modid AND e.moduleid=t.modid AND e.studentid=$1 AND e.isaccepted=true",[id],(error,results)=>{
                if(error) throw error;
                res.status(200).json(results.rows);
            });
        }else{
            pool.query("SELECT teacherid FROM teacher WHERE teacherid=$1",[id],(error,results)=>{
                if(results.rows.length){
                    pool.query("SELECT m.modname,m.descrip,m.modcode FROM module m,teacherrequests t WHERE t.acceptstatus=true AND t.modid=m.modid AND t.tid=$1 AND isconducting=true",[id],(error,results)=>{
                        if(error) throw error;
                        res.status(200).json(results.rows);
                    });
                }else{
                    res.status(400).send("No user enrolled or conducting courses");
                }
            });
        

        }
    });

};



module.exports = {
    getcourses,
    getsinglecourses,
    searchedcourses,
    addCourse,
    deleteCourse,
    updateCourse,
    studentfinishedcourses,
    updateprogress,
    studentincourse,
    conductorenrollcourse,
    
};