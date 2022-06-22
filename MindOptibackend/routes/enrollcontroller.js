const pool = require("../db");

//get student regestered or req courses
const getcoursesstudentrequorenr = async(req,res) => {
    const sid=req.params.sid;
    await pool.query("SELECT m.modname,m.sdate,m.enddate,m.descrip FROM Module m,EnrollmentRequest e WHERE m.modid=e.moduleid AND e.studentid=$1",[sid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};
//student req for module
const getreqformodule = async(req,res) => {
    const modid=req.params.modid;
    await pool.query("SELECT u.username,u.userid,e.requestedid,u.email,m.modname,m.modid FROM user_ u,EnrollmentRequest e,module m WHERE m.modid=e.moduleid AND e.moduleid=$1 AND u.userid=e.studentid AND e.isaccepted IS NULL",[modid],(error,results)=>{
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
    await pool.query("SELECT t.tid,t.modid,t.requesttime,m.modname,u.username,m.modcode FROM teacherrequests t,module m,user_ u WHERE t.modid=m.modid AND t.acceptstatus=false AND t.tid=u.userid",(error,results)=>{
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
            pool.query("UPDATE enrollmentrequest SET acceptid=$1,accepttime=CURRENT_TIMESTAMP,isaccepted=true,progress=0 WHERE moduleid=$2 AND studentid=$3",[acceptid,modid,sid],(error,results)=>{
                if(error) throw error;
                res.status(200).send("Accepted request to enroll");
               
            });
        }else{
            res.status(400).send("Cannot find request");
        }
    });
};

//remove student from enroled course
const removestudent = async (req,res) => {
    const sid = req.params.sid;
    const modid= req.params.modid;
    await pool.query("SELECT requestedid FROM enrollmentrequest WHERE moduleid=$1 AND studentid=$2 AND isaccepted=true",[modid,sid],(error,results)=>{
        if(!results.rows.length){
            res.status(400).send("Not accepted or No any record");
        }else{
            pool.query("DELETE FROM enrollmentrequest WHERE moduleid=$1 AND studentid=$2",[modid,sid],(error,results)=>{
                if (error) throw error;
                res.status(200).send("Removed Students");
            });
            
        }
    });
};

const deletestudentreq = async (req,res) => {
    const id = req.params.id;
    await pool.query("SELECT requestedid FROM enrollmentrequest WHERE requestedid=$1 AND isaccepted IS NULL",[id],(error,results)=>{
        if(results.rows.length){
            pool.query("DELETE FROM enrollmentrequest WHERE requestedid=$1",[id],(error,results)=>{
                if (error) throw error;
                res.status(200).send("Removed Request");
            });
        }else{
            res.status(400).send("no request")
        }
    })

}
    
const assignteachertomodule = async(req,res) => {
    const admin = req.params.admin;
    const tid = req.body.tid;
    const modid = req.params.modid;
    await pool.query("SELECT teacherid FROM teacher WHERE teacherid=$1",[tid],(error,results)=>{
        if(results.rows.length){
            pool.query("SELECT modid FROM module WHERE isconducting=true AND modid=$1",[modid],(error,results)=>{
                if(!results.rows.length){
                    pool.query("UPDATE teacherrequests SET acceptby=$1,acceptstatus=true WHERE modid=$2 AND tid=$3",[admin,modid,tid],(error,results)=>{
                        if(error) throw error;
                        pool.query("UPDATE Module SET isconducting=true,teacherid=$2 WHERE modid=$1",[modid,tid],(error,results)=>{
                            if(error) throw error;
                            res.status(200).send("Assign teacher");
                        });
                    });
                    
                }else{
                    res.status(400).send("Allready conducting by teacher");
                }
            })
            
        }else
           
        {
            res.status(400).send("Cannot find teacher");
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
    removestudent,
    getreqformodule,
    deletestudentreq,
    assignteachertomodule,
};