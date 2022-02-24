const pool = require("../db");

//get student regestered or req courses
const getcoursesstudentrequorenr = async(req,res) => {
    const sid=req.params.sid;
    await pool.query("SELECT m.modname,m.sdate,m.enddate,m.descrip FROM Module m,EnrollmentRequest e WHERE m.modid=e.moduleid AND e.studentid=$1",[sid],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getcoursesstudentrequorenr,
};