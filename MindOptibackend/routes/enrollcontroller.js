const pool = require("../db");

//get student regestered or req courses
const getcoursesstudentrequorenr = async(req,res) => {
    const sid=req.params.sid;
    await pool.query("SELECT m.modname,m.sdate,m.enddate,m.descrip FROM Module m,EnrollmentRequest e WHERE m.modid=e.moduleid AND e.studentid=$1",[sid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//teacher request for conduct
const teacherrequest = async(req,res) => {
    const tid = req.params.tid;
    const modid = req.params.modid;
    //const {tid,modid}=req.body;if you use body use this with change of course.js router removing :tid&:modid
    await pool.query("SELECT tid FROM teacherrequests WHERE tid=$1 AND modid=$2",[tid,modid],(error,results) =>{
        if(!results.rows.length){
            pool.query("SELECT teacherid FROM teacher WHERE teacherid=$1",[tid],(error,results) => {
                if (results.rows.length){
                    pool.query("SELECT ModID FROM Module WHERE ModID=$1 AND isconducting IS NULL",[modid],(error,results) => {
                        if (results.rows.length){
                            pool.query("INSERT INTO teacherrequests (tid,modid,requesttime,acceptstatus) values ($1,$2,CURRENT_TIMESTAMP,'0')",[tid,modid],(error,results)=>{
                                if (error) throw error;
                                res.status(201).send("Requested to conduct");
                            });
                    }else{
                        if (error) throw error;
                        res.status(401).send("Not founded the Course");
                    }
    
                    });
                }else{
                    if (error) throw error;
                    res.status(401).send("Not founded the Teacher");
                }
            
            });

        }else{
            if (error) throw error;
            res.status(401).send("Already Requested");
        }
        

    });

};

//show the teacher request list 
const getteacherrequestlist = async(req,res) => {
    await pool.query("SELECT t.tid,t.modid,t.requesttime,m.modname FROM teacherrequests t,module m WHERE t.modid=m.modid AND t.acceptstatus=false",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//accept teacher to conduct
const acceptteacherrequest = async(req,res) => {
    const admin = req.params.admin;
    const tid = req.params.tid;
    const modid = req.params.modid;
    await pool.query("SELECT tid FROM teacherrequests WHERE tid=$1 AND modid=$2",[tid,modid],(error,results)=>{
        if(results.rows.length){
            pool.query("UPDATE teacherrequests SET acceptby=$1,acceptstatus=true WHERE modid=$2 AND tid=$3",[admin,modid,tid],(error,results)=>{
                if(error) throw error;
                pool.query("UPDATE Module SET isconducting=true WHERE modid=$1",[modid],(error,results)=>{
                    if(error) throw error;
                    res.status(200).send("Accepted request");
                });
            });
        }else{
            res.status(400).send("Cannot find request");
        }
    });

};

//remove teacher from conducting module
const removeteacher= async(req,res) => {
    const tid=req.params.tid;
    const modid=req.params.modid;
    await pool.query("SELECT teacherid FROM teacher WHERE teacherid=$1 ",[tid],(error,results)=>{
        if (!results.rows.length){
            res.send("No any teacher from that id");
        }else{
            pool.query("UPDATE Module SET isconducting=null WHERE modid=$1",[modid],(error,results)=>{
                if(error)throw error;
                res.status(201).send("Teacher Removed");
            });
        }

    });

 };//has problem delete foreighn key solved by adding is conducting

 //student req to enroll for course
const studentenrollrequest = async (req,res)=>{
    const sid = req.params.sid;
    const modid = req.params.modid;
    //const {tid,modid}=req.body;if you use body use this with change of course.js router removing :tid&:modid
    await pool.query("SELECT studentid FROM enrollmentrequest WHERE studentid=$1 AND moduleid=$2",[sid,modid],(error,results) =>{
        if(!results.rows.length){
            pool.query("SELECT studentid FROM student WHERE studentid=$1",[sid],(error,results) => {
                if (results.rows.length){
                    pool.query("SELECT ModID FROM Module WHERE ModID=$1 AND isconducting IS NOT NULL",[modid],(error,results) => {
                        if (results.rows.length){
                            pool.query("INSERT INTO enrollmentrequest (moduleid,studentid,requestedtime) values ($1,$2,CURRENT_TIMESTAMP)",[modid,sid],(error,results)=>{
                                if (error) throw error;
                                res.status(201).send("Requested to enroll");
                            });
                    }else{
                        if (error) throw error;
                        res.status(401).send("Not founded the Course");
                    }
    
                    });
                }else{
                    if (error) throw error;
                    res.status(401).send("You are not a student");
                }
            
            });

        }else{
            if (error) throw error;
            res.status(401).send("Already Requested");
        }
        

    });

};

//accept student enrollment rrequest
const acceptstudentrequest = async (req,res) => {
    const acceptid = req.params.accid;
    const sid = req.params.sid;
    const modid = req.params.modid;
    await pool.query("SELECT studentid FROM enrollmentrequest WHERE studentid=$1 AND moduleid=$2",[sid,modid],(error,results)=>{
        if(results.rows.length){
            pool.query("UPDATE enrollmentrequest SET acceptid=$1,accepttime=CURRENT_TIMESTAMP,isaccepted=true WHERE moduleid=$2 AND studentid=$3",[acceptid,modid,sid],(error,results)=>{
                if(error) throw error;
                res.status(200).send("Accepted request to enroll");
               
            });
        }else{
            res.status(400).send("Cannot find request");
        }
    });
};


module.exports = {
    getcoursesstudentrequorenr,
    teacherrequest,
    getteacherrequestlist,
    acceptteacherrequest,
    removeteacher,
    studentenrollrequest,
    acceptstudentrequest,
};