const pool = require("../db");

//get all courses
const getcourses = async(req,res) => {
    await pool.query("SELECT * FROM Module",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getcourses,
  
    
};