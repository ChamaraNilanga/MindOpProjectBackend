const pool = require("../db");

//get all users
const getusers = async(req,res) => {
    await pool.query("SELECT UserId,UserName FROM User_",(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};

//get user profile
const userpro  = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM User_ WHERE UserId=$1",[key],(error,results)=>{
        if (error) throw  error;
        res.status(200).json(results.rows);
    });
};


//get searched user
 const searcheduser = async(req,res) => {
     const key= req.params.key;
      await pool.query("SELECT UserId,UserName FROM User_ WHERE UserName LIKE '%' || $1 || '%' or UserId LIKE '%' || $1 || '%' ",[key],(error,results)=>{
         if (error) throw  error;
         res.status(200).json(results.rows);
     });
};

//add a user
 const adduser = async(req,res) => {
     const {uid,usernam,gen,dob,email,psswd,homeno,laneno,city,contactno,admin,tcher,stdnt} =req.body;
     //check already added
     await pool.query("SELECT UserName FROM User_ WHERE UserId=$1 OR Email=$2",[uid,email],(error,results)=>{
        if (results.rows.length){
            res.send("Already added");
        }else{
        pool.query("INSERT INTO User_ (UserId,UserName,Gender,DOB,Email,Pass_word,Home_no,Lane,City,ContactNo,Teacher,Admin_,Student) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",[uid,usernam,gen,dob,email,psswd,homeno,laneno,city,contactno,admin,tcher,stdnt],(error,results)=>{
            if (error) throw  error;
            res.status(200).send("user added");
        
        });
      }
    });

 };


//delete user
 const deleteUser= async(req,res) => {
    const id=req.params.id;
    await pool.query("SELECT UserId FROM User_ WHERE UserId=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("No any user");
        }else{
            pool.query("DELETE FROM User_ WHERE UserId=$1 ",[id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("user Deleted");
            });
        }

    });

 };


//update user
 const updateuser=async(req,res)=>{
     const id=req.params.id;
     const { usernam,email,psswd,contactno }=req.body;
     await pool.query("SELECT UserId FROM User_ WHERE UserId=$1 ",[id],(error,results)=>{
        if (!results.rows.length){
            res.send("NO user");
        }else{
            pool.query("UPDATE User_ SET UserId=$1,UserName=$2,Email=$3,Pass_word=$4,ContactNo=$5 WHERE UserId=$6 ",[id,usernam,email,psswd,contactno,id],(error,results)=>{
                if(error)throw error;
                res.status(201).send("user details Updated");
            });
        }

    });

 };
 // login
 





module.exports = {
    getusers,
    userpro,
    searcheduser,
    adduser,
    deleteUser,
    updateuser,

    
};