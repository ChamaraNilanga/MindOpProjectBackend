const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");
const validInfo = require("../middleware/validInfo");



//get all users
const getusers = async(req,res) => {
    await pool.query("SELECT UserId,UserName,Pass_word FROM User_",(error,results)=>{
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

//get email confirmation
const emailconfirm  = async(req,res) => {
    const key= req.params.key;
     await pool.query("SELECT * FROM User_ WHERE Email=$1",[key],(error,results)=>{
        if (results.rows.length){
            // res.send("Email valid");
            res.status(200).send("Email valid");
        }else{
            //res.send("Email not valid");
            res.status(200).send("Email is not valid");
        }
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
     const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(psswd,salt);
     await pool.query("SELECT UserName FROM User_ WHERE UserId=$1 OR Email=$2",[uid,email],(error,results)=>{
        if (results.rows.length){
            res.send("Already added");
        }else{
        pool.query("INSERT INTO User_ (UserId,UserName,Gender,DOB,Email,Pass_word,Home_no,Lane,City,ContactNo,Teacher,Admin_,Student) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",[uid,usernam,gen,dob,email,bcryptPassword,homeno,laneno,city,contactno,tcher,admin,stdnt],(error,results)=>{
            if (error)throw error;
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

const login = async(req,res) => {
    const {uid,psswd,email} =req.body;  
    try {
      const user = await pool.query("SELECT * FROM User_ WHERE UserId=$1 OR Email=$2", [uid,email]);
  
      if (user.rows.length === 0) {
        return res.status(200).json("Invalid Credential");
      }
      
      const validPassword = await bcrypt.compare(psswd,user.rows[0].pass_word);
      if (!validPassword) {
        return res.status(200).json("Invalid Credential");
      }
      
      {
        const jwtToken = jwtGenerator(user.rows[0].UserId,user.rows[0].teacher,user.rows[0].student,user.rows[0].admin_);
    return res.json({ jwtTokens:jwtToken,teacher:user.rows[0].teacher,student:user.rows[0].student,admin:user.rows[0].admin_,userid:user.rows[0].userid});
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  };


module.exports = {
    getusers,
    userpro,
    searcheduser,
    adduser,
    deleteUser,
    updateuser,
    login,
    emailconfirm

};