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
                    pool.query("SELECT ModID FROM Module WHERE ModID=$1 AND teacherid IS NULL",[modid],(error,results) => {
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


module.exports = {
    getcoursesstudentrequorenr,
    teacherrequest,
    getteacherrequestlist,
};